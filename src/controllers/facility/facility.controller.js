//Model
const Facility = require("../../models/Facility.model.js");
const SavedFacility = require("../../models/SavedFacility.model.js");
const {
  bulkOrganizationEnrichment,
  singleOrganizationEnrichment,
  organizationContactList,
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

// const allFacility = async (req, res) => {
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

const detailOfFacility = async (req, res, next) => {
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

const facilityContactList = async (req, res, next) => {
  //orgId represents the organization orgId from Apollo
  const { orgId } = req.params;
  try {
    const data = await organizationContactList(orgId);
    return success(res, 200, "Success", data);
  } catch (err) {
    return next(err);
  }
};

const saveFacility = async (req, res, next) => {
  try {
    await SavedFacility.create({
      facilityId: req.body.facilityId,
      shortDescription: req.body.shortDescription,
      industry: req.body.industry,
      linkedInUrl: req.body.linkedInUrl,
    });
    return status200(res, "Facility saved successfully");
  } catch (err) {
    return next(err);
  }
};

const attachSaleArea = async (req, res, next) => {
  const { id } = req.params;
  const { saleAreaId } = req.body;
  try {
    await SavedFacility.updateOne(
      {
        _id: id,
      },
      {
        saleAreaId: saleAreaId,
      }
    );
    return status200(res, "Sale area attached to the facility");
  } catch (err) {
    return next(err);
  }
};

const allSavedFacilities = async (req, res, next) => {
  try {
    // const { data, totalRecords, totalPages, currentPage, limit } =
    //   await paginate(SavedFacility, {}, page, pageSize);
    const data = await SavedFacility.find().populate({ path: "facilityId" });
    return success(res, 200, "Saved facility", data);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  allFacility,
  detailOfFacility,
  facilityContactList,
  saveFacility,
  allSavedFacilities,
  attachSaleArea,
};
