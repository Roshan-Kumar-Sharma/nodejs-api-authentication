// const { google } = require("googleapis");
// const nodemailer = require("nodemailer");

// require("dotenv").config();

// // const c = process.env.CLIENT_ID;
// // console.log("inside" + c);

// const CLIENT_ID = process.env.CLIENT_ID;
// const CLIENT_SECRET = process.env.CLIENT_SECRET;
// const REDIRECT_URI = process.env.REDIRECT_URI;
// const REFRESH_TOKEN = process.env.REFRESH_TOKEN;
// let transporter, accessToken;

// const OAuth2Client = new google.auth.OAuth2(
//     CLIENT_ID,
//     CLIENT_SECRET,
//     REDIRECT_URI
// );

// OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

// setupMail();

// transporter = async function setupMail() {
//     try {
//         accessToken = await OAuth2Client.getAccessToken();

//         transporter = nodemailer.createTransport({
//             service: "gmail",
//             auth: {
//                 type: "OAuth2",
//                 user: process.env.USER_GMAIL,
//                 clientId: CLIENT_ID,
//                 clientSecret: CLIENT_SECRET,
//                 refreshToken: REFRESH_TOKEN,
//                 accessToken: accessToken,
//             },
//         });

//         // const mailOptions = {
//         //     to: "ramdhyansharmamika@gmail.com",
//         //     from: process.env.USER_GMAIL,
//         //     subject: "Hello",
//         //     text: "Express server",
//         //     html: "<h1>Express server</h1>",
//         // };

//         // const message = await transporter.sendMail(mailOptions);

//         // console.log(message);
//         // return message;
//         console.log(transporter);
//     } catch (err) {
//         console.log(err);
//         // return err;
//     }
// };

// console.log("hello" + transporter);

const { google } = require("googleapis");
const nodemailer = require("nodemailer");

require("dotenv").config();

// const c = process.env.CLIENT_ID;
// console.log("inside" + c);

const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET;
const REDIRECT_URI = process.env.REDIRECT_URI;
const REFRESH_TOKEN = process.env.REFRESH_TOKEN;

const OAuth2Client = new google.auth.OAuth2(
    CLIENT_ID,
    CLIENT_SECRET,
    REDIRECT_URI
);

module.exports = (async () => {
    OAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });
    try {
        let accessToken = await OAuth2Client.getAccessToken();

        let transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                type: "OAuth2",
                user: process.env.USER_GMAIL,
                clientId: CLIENT_ID,
                clientSecret: CLIENT_SECRET,
                refreshToken: REFRESH_TOKEN,
                accessToken: accessToken,
            },
        });
        return transporter;
    } catch (err) {
        console.log(err);
        // return err;
    }
})();

// module.exports.getTransporter = async () => {
//     return transporterPromise;
// };
// module.exports = transporter;
