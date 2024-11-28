const extractDomain = (url) => {
  try {
    const hostname = new URL(url).hostname;
    return hostname.replace(/^www\./, "");
  } catch (err) {
    return "";
  }
};

module.exports = { extractDomain };
