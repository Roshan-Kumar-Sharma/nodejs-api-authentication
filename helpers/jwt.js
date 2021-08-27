const jwt = require("jsonwebtoken");
const createHttpError = require("http-errors");
require("dotenv").config();

module.exports = {
    signAccessToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};

            const secret = process.env.ACCESS_TOKEN_SECRET;

            const options = {
                expiresIn: "1m",
                issuer: "codewithroshan.com",
                audience: userId,
            };

            jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    // return reject(err)
                    console.log("\n" + err.message + "\n");
                    return reject(createHttpError.InternalServerError());
                }
                resolve(token);
            });
        });
    },
    verifyAccessToken: (req, res, next) => {
        if (!req.headers.authorization)
            return next(createHttpError.Unauthorized());

        const authHeader = req.headers.authorization;
        const bearerToken = authHeader.split(" ");
        const token = bearerToken[1];

        jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, payload) => {
            if (err) {
                if (err.name !== "JsonWebTokenError")
                    return next(createHttpError.Unauthorized(err));
                console.log("\n" + err.name + " : " + err.message + "\n");
                return next(createHttpError.Unauthorized());

                // const message = err.name === 'JsonWebTokenError' ? 'Unauthorized' : err.message

                // return next(createHttpError.Unauthorized(message))
            }

            req.payload = payload;
            next();
        });
    },
    signRefreshToken: (userId) => {
        return new Promise((resolve, reject) => {
            const payload = {};

            const secret = process.env.REFRESH_TOKEN_SECRET;

            const options = {
                expiresIn: "2m",
                issuer: "codewithroshan.com",
                audience: userId,
            };

            jwt.sign(payload, secret, options, (err, token) => {
                if (err) {
                    // return reject(err)
                    console.log("\n" + err.message + "\n");
                    return reject(createHttpError.InternalServerError());
                }
                resolve(token);
            });
        });
    },
    verifyRefreshToken: (refreshToken) => {
        return new Promise((resolve, reject) => {
            jwt.verify(
                refreshToken,
                process.env.REFRESH_TOKEN_SECRET,
                (err, payload) => {
                    if (err) return reject(createHttpError.Unauthorized());

                    const userId = payload.aud;
                    resolve(userId);
                }
            );
        });
    },
};
