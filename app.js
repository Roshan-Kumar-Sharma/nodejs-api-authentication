const express = require("express");
const morgan = require("morgan");
const createHttpError = require("http-errors");
const dotenv = require("dotenv").config();

const AuthRoutes = require("./routes/auth.routes");
const { verifyAccessToken } = require("./helpers/jwt");
// require("./helpers/initRedis");
require("./helpers/initMongoDB");

// const { getTransporter } = require("./helpers/gmail");

// const { getTransporter } = require("./helpers/gmail");
// console.log(await getTransporter());

const PORT = process.env.PORT || 8888;

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/auth", AuthRoutes);

app.get("/", verifyAccessToken, async (req, res, next) => {
    console.log(req.payload);
    res.send("Hello form express");
});

app.use(async (req, res, next) => {
    // const error = new Error('This endpoint is not available.')
    // error.status = 400
    // next(error)

    next(createHttpError.NotFound("This endpoint is not available."));
});

app.use(async (err, req, res, next) => {
    res.status(err.status || 500).send({
        error: {
            message: err.message,
            status: err.status || 500,
        },
    });
});

// console.log(process.env.CLIENT_ID);

app.listen(PORT, () => {
    console.log(`server is running on port ${PORT}`);
});
