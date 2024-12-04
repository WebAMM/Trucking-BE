const axios = require("axios");
const { apollo_url, apollo_api_key } = require("../../config");

const bulkOrganizationEnrichment = async (domains) => {
  const baseUrl = `${apollo_url}/organizations/bulk_enrich`;
  try {
    console.log("The domains", domains);
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
        "x-api-key": apollo_api_key,
      },
    };
    const response = await axios.request(options);
    console.log("The response", response.data.organizations);
    return response.data.organizations;
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
        "x-api-key": apollo_api_key, // Ensure the API key is valid
      },
    };
    const response = await axios.request(options);
    return response.data.organization;
  } catch (err) {
    console.error("Error enriching domain:", domain, err);
    throw err; // Propagate the error
  }
};

const organizationContactList = async (orgId) => {
  const baseUrl = `${apollo_url}/mixed_people/search?organization_ids[]=${orgId}`;
  try {
    const options = {
      method: "POST",
      url: baseUrl,
      headers: {
        accept: "application/json",
        "Cache-Control": "no-cache",
        "Content-Type": "application/json",
        "x-api-key": "Vkd7rdywhd0q9qVGQ9Uvag",
      },
    };
    const response = await axios.request(options);
    return response.data.contacts;
  } catch (err) {
    console.log("The err", err);
    throw err;
  }
};

module.exports = {
  bulkOrganizationEnrichment,
  singleOrganizationEnrichment,
  organizationContactList,
};
