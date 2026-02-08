// Detect subdomain for *.divinewisdom.edu.in
module.exports = (req, res, next) => {
  const host = req.headers.host?.split(":")[0]; // remove port if present
  const parts = host?.split(".");

  // Host format: subdomain.domain.tld
  // Example: admissions.divinewisdom.edu.in -> ["admissions","divinewisdom","edu","in"]
  if (!parts || parts.length < 4) {
    req.subdomain = null; // main domain
    return next();
  }

  const subdomain = parts[0];

  // Only allow "admissions" as valid subdomain
  if (subdomain === "admissions") {
    req.subdomain = subdomain;
  } else {
    req.subdomain = null; // other subdomains ignored
  }

  next();
};
