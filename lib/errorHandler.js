module.exports = (err, req, res, next) => {

    console.error(err);

    let errors = [];
    if (err.statusCode === 404) {
        errors.push({
            status: 404,
            "title": "Station not found",
            "detail": "The station you requested could not be found"
        });
    }

    if (errors.length === 0) {
        errors.push({
            status: 500,
            "title": "Unknown error",
            "detail": "Something bad happened"
        });
    }

    return res.status(err.statusCode || 500).json({
        errors
    });
}
