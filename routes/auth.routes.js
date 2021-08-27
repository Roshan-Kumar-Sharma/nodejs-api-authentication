const express = require("express");
const router = express.Router();
const createHttpError = require("http-errors");
const User = require("../models/user.model");
const { authSchema } = require("../helpers/validation_schema");
const {
    signAccessToken,
    signRefreshToken,
    verifyRefreshToken,
} = require("../helpers/jwt");

// require("../helpers/gmail");
const transporter = require("../helpers/gmail");

router.post("/register", async (req, res, next) => {
    // console.log(req.body)
    try {
        // const {email, password} = req.body
        // if(!email || !password){
        //     throw createHttpError.BadRequest('Either email or password missing.')
        // }

        const result = await authSchema.validateAsync(req.body);

        // console.log(result);

        const doesExist = await User.findOne({ email: result.email });

        if (doesExist)
            throw createHttpError.Conflict(`${result.email} already exists`);

        const user = new User(result);
        const savedUser = await user.save();

        const accessToken = await signAccessToken(savedUser.id);
        const refreshToken = await signRefreshToken(savedUser.id);

        res.send({ accessToken, refreshToken });
    } catch (err) {
        if (err.isJoi === true)
            return next(
                createHttpError.BadRequest("Invalid Username/Password")
            );
        next(err);
    }
});

router.post("/login", async (req, res, next) => {
    try {
        const result = await authSchema.validateAsync(req.body);

        const user = await User.findOne({ email: result.email });

        if (!user) throw createHttpError.NotFound("User is not registered");

        const isValid = await user.isValidPassword(result.password);

        if (!isValid)
            throw createHttpError.Unauthorized("Username/Password is wrong");

        const accessToken = await signAccessToken(user.id);
        const refreshToken = await signRefreshToken(user.id);

        res.send({ accessToken, refreshToken });
    } catch (err) {
        if (err.isJoi === true)
            return next(
                createHttpError.BadRequest("Invalid Username/Password")
            );
        next(err);
    }
});

router.post("/refresh-token", async (req, res, next) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) throw createHttpError.BadRequest();

        const userId = await verifyRefreshToken(refreshToken);

        const newAccessToken = await signAccessToken(userId);
        const newRefreshToken = await signRefreshToken(userId);

        res.send({
            accessToken: newAccessToken,
            refreshToken: newRefreshToken,
        });
    } catch (err) {
        next(err);
    }
});

router.delete("/logout", async (req, res, next) => {
    res.send("logout route");
});

module.exports = router;
