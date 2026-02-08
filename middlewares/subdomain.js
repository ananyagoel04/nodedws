// middlewares/subdomain.js
module.exports = (req, res, next) => {
  const host = req.headers.host?.split(":")[0];
  const parts = host?.split(".");

  // Example: admissions.divinewisdom.edu.in -> ["admissions","divinewisdom","edu","in"]
  if (!parts || parts.length < 4) {
    req.subdomain = null; // main domain
    return next();
  }

  req.subdomain = parts[0]; // dynamically detect first part as subdomain
  next();
};
