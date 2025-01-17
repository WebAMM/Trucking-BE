// Model
const Facility = require("../../models/Facility.model.js");
// Response and errors
const { error404 } = require("../../services/helpers/errors.js");
const { status200, success } = require("../../services/helpers/response.js");
// Helpers
const { extractDomain } = require("../../services/helpers/extractDomain.js");
const {
  bulkOrganizationEnrichment,
  singleOrganizationEnrichment,
  peopleEnrichment,
  peopleSearch,
} = require("../../services/helpers/apollo.js");

// All facilities
const allFacility = async (req, res, next) => {
  const { page = 1, pageSize = 100, radius = 10000, search, address, zipCode } = req.query;
  try {
    const currentPage = parseInt(page);
    const pageLimit = parseInt(pageSize);
    const skip = (currentPage - 1) * pageLimit;

    let query = {};
    if (search || address || zipCode) {
      query.$or = [];
    }

    if (search) {
      query.$or.push({ name: { $regex: search, $options: "i" } });
    }

    if (address || zipCode) {
      if (address) {
        query.$or.push({ streetAddress: { $regex: address, $options: "i" } });
      }

      if (zipCode) {
        query.$or.push({
          $expr: {
            $regexMatch: {
              input: { $toString: "$postalCode" },
              regex: zipCode,
              options: "i",
            },
          },
        });
      }
    }

    let data = await Facility.aggregate([
      {
        $geoNear: {
          near: req.user?.location?.coordinates || [-83.128166, 39.9169786],
          distanceField: "distance",
          maxDistance: parseFloat(radius),
          spherical: true
        }
      },
      { $match: query },
      { $sort: { createdAt: -1 } },
      { $skip: skip },
      { $limit: pageLimit }
    ]);

    const totalData = await Facility.countDocuments(query);
    const totalPages = Math.ceil(totalData / pageLimit);

    let extractedDomains = data.length !== 0 ? data.map((facility) => extractDomain(facility.websiteURL)) : [];
    let enrichedData = extractedDomains.length !== 0 ? await bulkOrganizationEnrichment(extractedDomains) : null;

    const enrichedFacilities = data.map((facility, index) => ({
      ...facility,
      organizationEnriched: enrichedData[index],
    }));

    let response = {
      data: enrichedFacilities,
      pagination: {
        totalItems: totalData,
        totalPages,
        currentPage,
        limit: pageLimit,
      },
    };

    return success(res, 200, "Success", response);
  } catch (err) {
    return next(err);
  }
};

// Detail of facility, enriching the data from apollo
const detailOfFacility = async (req, res, next) => {
  // Id in params of facility
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

// People Search API of Apollo
const facilitySearchPeople = async (req, res, next) => {
  // orgId represents the organization orgId from Apollo
  const { orgId } = req.params;
  try {
    const data = await peopleSearch(orgId);
    return success(res, 200, "Success", data);
  } catch (err) {
    return next(err);
  }
};

// People Enrichment API of Apollo
const facilityPeopleEnrichment = async (req, res, next) => {
  // orgId represents the person id from Apollo People Search
  const { peopleId } = req.params;
  try {
    const data = await peopleEnrichment(peopleId);
    return success(res, 200, "Success", data);
  } catch (err) {
    return next(err);
  }
};

module.exports = {
  allFacility,
  detailOfFacility,
  facilitySearchPeople,
  facilityPeopleEnrichment,
};
