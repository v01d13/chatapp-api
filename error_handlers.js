module.exports = (fn) => {
    return function (req, res, next) {
        fn(req, res, next).catch((err) => {
            if (typeof err === "string") {
                res.status(401).json({
                    "success": 0,
                    "message": err
                });

                console.log(err)
            } else {
                console.error(err);
            }
        })
    }
};
