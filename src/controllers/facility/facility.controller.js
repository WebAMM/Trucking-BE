//Model
const Facility = require("../../models/Facility.model.js");
//Response and errors
const { error404 } = require("../../services/helpers/errors.js");
const { status200, success } = require("../../services/helpers/response.js");
//Helpers
const paginate = require("../../services/helpers/pagination.js");
const { extractDomain } = require("../../services/helpers/extractDomain.js");
const {
  bulkOrganizationEnrichment,
  singleOrganizationEnrichment,
  peopleEnrichment,
  peopleSearch,
} = require("../../services/helpers/apollo.js");

//All facilities
const allFacility = async (req, res, next) => {
  const { page = 1, pageSize = 10 } = req.query;
  try {
    const { data, totalRecords, totalPages, currentPage, limit } =
      await paginate(Facility, {}, page, pageSize);
    const extractedDomains = data.map((facility) =>
      extractDomain(facility.websiteURL)
    );

    const enrichedData = await bulkOrganizationEnrichment(extractedDomains);
    const enrichedFacilities = data.map((facility, index) => ({
      ...facility,
      organizationEnriched: enrichedData[index],
    }));

    let response = {
      data: enrichedFacilities,
      totalRecords,
      totalPages,
      currentPage,
      limit,
    };

    return success(res, 200, "Success", response);
  } catch (err) {
    return next(err);
  }
};

//Detail of facility, enriching the data from apollo
const detailOfFacility = async (req, res, next) => {
  //Id in params of facility
  const { id } = req.params;
  try {
    const data = await Facility.findById(id).lean();

    if (data) {
      const organizationData = await singleOrganizationEnrichment(
        data.websiteURL
      );
      const enrichedData = { ...data, ...organizationData };
      return success(res, 200, "Success", enrichedData);
    }
    return error404(res, "No facility found");
  } catch (err) {
    return next(err);
  }
};

//People Search API of Apollo
const facilitySearchPeople = async (req, res, next) => {
  //orgId represents the organization orgId from Apollo
  const { orgId } = req.params;
  try {
    const data = await peopleSearch(orgId);
    return success(res, 200, "Success", data);
  } catch (err) {
    return next(err);
  }
};

//People Enrichment API of Apollo
const facilityPeopleEnrichment = async (req, res, next) => {
  //orgId represents the person id from Apollo People Search
  const { peopleId } = req.params;
  try {
    const data = await peopleEnrichment(peopleId);
    return success(res, 200, "Success", data);
  } catch (err) {
    return next(err);
  }
};

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

// const allFacility = async (req, res, next) => {
//   const { page = 1, pageSize = 10, address } = req.query;
//   try {
//     const filter = address
//       ? { streetAddress: { $regex: address, $options: "i" } }
//       : {};

//     const { data, totalRecord, totalPages, currentPage, limit } =
//       await paginate(Facility, filter, page, pageSize);

//     const extractedDomains = data.map((facility) =>
//       extractDomain(facility.WebsiteURL)
//     );
//     const enrichedData = [];

//     for (let i = 0; i < extractedDomains.length; i++) {
//       const domain = extractedDomains[i];
//       try {
//         const enrichmentData = await singleOrganizationEnrichment(domain);
//         enrichedData.push(enrichmentData);
//       } catch (err) {
//         enrichedData.push(null);
//       }
//     }

//     const enrichedFacilities = data.map((facility, index) => ({
//       ...facility,
//       enrichedData: enrichedData[index],
//     }));

//     let response = {
//       data: enrichedFacilities,
//       totalRecord,
//       totalPages,
//       currentPage,
//       limit,
//     };

//     return success(res, 200, "Success", response);
//   } catch (err) {
//     return error500(res, err);
//   }
// };

module.exports = {
  allFacility,
  detailOfFacility,
  facilitySearchPeople,
  facilityPeopleEnrichment,
};
