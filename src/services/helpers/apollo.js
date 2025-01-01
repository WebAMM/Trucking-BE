const axios = require("axios");
const {
  apollo_url,
  apollo_org_api_key,
  apollo_people_api_key,
} = require("../../config");

const bulkOrganizationEnrichment = async (domains) => {
  const baseUrl = `${apollo_url}/organizations/bulk_enrich`;
  try {
    const queryParams = domains
      .map((domain) => `domains[]=${domain}`)
      .join(`&`);
    const fullUrl = `${baseUrl}?${queryParams};`;
    const options = {
      method: "POST",
      url: fullUrl,
      headers: {
        accept: "application/json",
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "x-api-key": apollo_org_api_key,
      },
    };
    const response = await axios.request(options);
    const modifiedResponse =
      response?.data &&
      response?.data?.organizations?.length &&
      response?.data?.organizations?.map((org) => {
        return {
          orgId: org?.id,
          orgName: org?.name,
          websiteUrl: org?.website_url,
          linkedInUrl: org?.linkedin_url,
          phoneNo: org?.phone,
          industry: org?.industry,
          shortDescription: org?.short_description,
        };
      });
    return modifiedResponse;
  } catch (err) {
    throw err;
  }
};

const singleOrganizationEnrichment = async (domain) => {
  const baseUrl = `${apollo_url}/organizations/enrich?domain=${domain}`;
  try {
    const options = {
      method: "GET",
      url: baseUrl,
      headers: {
        accept: "application/json",
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "x-api-key": apollo_org_api_key,
      },
    };
    const response = await axios.request(options);
    const modifiedResponse = {
      orgId: response?.data?.organization?.id,
      orgName: response?.data?.organization?.website_url,
      linkedInUrl: response?.data?.organization?.linkedin_url,
      industry: response?.data?.organization?.industry,
      annualRevenuePrinted:
        response?.data?.organization?.annual_revenue_printed,
      annualRevenue: response?.data?.organization?.annual_revenue,
      shortDescription: response?.data?.organization?.short_description,
    };
    return modifiedResponse;
  } catch (err) {
    throw err;
  }
};

const peopleSearch = async (orgId) => {
  const baseUrl = `${apollo_url}/mixed_people/search?organization_ids[]=${orgId}`;
  try {
    const options = {
      method: "POST",
      url: baseUrl,
      headers: {
        accept: "application/json",
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "x-api-key": apollo_people_api_key,
      },
    };
    const response = await axios.request(options);
    const modifiedResponse =
      response?.data &&
      response?.data?.people?.length &&
      response?.data?.people.map((person) => {
        return {
          peopleId: person?.id,
          contactName: person?.name,
          title: person?.title,
          linkedInUrl: person?.linkedin_url,
          organizationName: person?.organization?.name,
          // phone: person?.organization.phone,
        };
      });
    return modifiedResponse;
  } catch (err) {
    throw err;
  }
};

const peopleEnrichment = async (peopleId) => {
  const baseUrl = `${apollo_url}/people/match?id=${peopleId}`;
  try {
    const options = {
      method: "POST",
      url: baseUrl,
      headers: {
        accept: "application/json",
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "x-api-key": apollo_people_api_key,
      },
    };
    const response = await axios.request(options);
    const modifiedResponse = {
      email: response?.data?.person?.email,
      phone: response?.data?.person?.organization?.phone,
      location: response?.data?.contact?.present_raw_address,
    };
    return modifiedResponse;
  } catch (err) {
    throw err;
  }
};

module.exports = {
  bulkOrganizationEnrichment,
  singleOrganizationEnrichment,
  peopleSearch,
  peopleEnrichment,
};
