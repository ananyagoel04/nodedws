// Detect subdomain for *.divinewisdom.edu.in
module.exports = (req, res, next) => {
  const host = req.headers.host?.split(":")[0]; 
  const parts = host?.split(".");

  if (!parts || parts.length < 4) {
    req.subdomain = null;
    return next();
  }

  req.subdomain = parts[0];
  next();
};
