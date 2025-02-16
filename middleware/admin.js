module.exports = function (req, resizeBy, next) {
  if (!req.user.isAdmin) return resizeBy.status(403).send("Access denied.");

  next();
};
