// 1) Runs when NO route matched the URL
function notFound(req, res, next) {
    res.status(404).json({ error: "Route not found: " + req.originalUrl });
}
// 2) Central error handler — MUST have 4 arguments
function errorHandler(err, req, res, next) {
    console.error(err.message);
    const status = err.name === "CastError" ? 400 : 500;
    res.status(status).json({ error: err.message });
}
module.exports = { notFound, errorHandler };