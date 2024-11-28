//Model
const Facility = require("../../models/Facility.model.js");
const {
  bulkOrganizationEnrichment,
  singleOrganizationEnrichment,
} = require("../../services/helpers/apollo.js");
//Response and errors
const { error500, error404 } = require("../../services/helpers/errors.js");
const { extractDomain } = require("../../services/helpers/extractDomain.js");
const paginate = require("../../services/helpers/pagination.js");
const { status200, success } = require("../../services/helpers/response.js");

//To handle with Bulk API of Apollo.io

// const extractDomain = (url) => {
//   try {
//     const hostname = new URL(url).hostname;
//     // console.log("The hostman", hostname.replace(/^www\./, ""));
//     // domains.push(hostname.replace(/^www\./, ""));
//     return hostname.replace(/^www\./, "");
//   } catch (err) {
//     return "";
//   }
// };

//All facilities
// const allFacility = async (req, res) => {
//   const { page = 1, pageSize = 10 } = req.query;
//   try {
//     const { data, totalDocuments, totalPages, currentPage, limit } =
//       await paginate(Facility, {}, page, pageSize);

//     const extractedDomains = data.map((facility) =>
//       extractDomain(facility.WebsiteURL)
//     );

//     // console.log("The data", data);
//     const enrichedData = await bulkOrganizationEnrichment(extractedDomains);
//     const enrichedFacilities = data.map((facility, index) => ({
//       ...facility,
//       apolloData: enrichedData[index],
//     }));

//     let response = {
//       data: enrichedFacilities,
//       totalDocuments,
//       totalPages,
//       currentPage,
//       limit,
//     };

//     return success(res, 200, "Success", response);
//   } catch (err) {
//     return error500(res, err);
//   }
// };

const allFacility = async (req, res) => {
  const { page = 1, pageSize = 10, address } = req.query;
  try {
    const filter = address
      ? { streetAddress: { $regex: address, $options: "i" } }
      : {};

    const { data, totalRecord, totalPages, currentPage, limit } =
      await paginate(Facility, filter, page, pageSize);

    const extractedDomains = data.map((facility) =>
      extractDomain(facility.WebsiteURL)
    );
    const enrichedData = [];

    for (let i = 0; i < extractedDomains.length; i++) {
      const domain = extractedDomains[i];
      try {
        const enrichmentData = await singleOrganizationEnrichment(domain);
        enrichedData.push(enrichmentData);
      } catch (err) {
        enrichedData.push(null);
      }
    }

    const enrichedFacilities = data.map((facility, index) => ({
      ...facility,
      enrichedData: enrichedData[index],
    }));

    let response = {
      data: enrichedFacilities,
      totalRecord,
      totalPages,
      currentPage,
      limit,
    };

    return success(res, 200, "Success", response);
  } catch (err) {
    return error500(res, err);
  }
};

const detailOfFacility = async (req, res) => {
  const { id } = req.params;
  try {
    const data = await Facility.findById(id).lean();

    if (data) {
      const organizationData = await singleOrganizationEnrichment(
        data.WebsiteURL
      );
      const enrichedData = { ...data, ...organizationData };
      return success(res, 200, "Success", enrichedData);
    }
  } catch (err) {
    return error500(res, err);
  }
};

module.exports = {
  allFacility,
  detailOfFacility,
};
