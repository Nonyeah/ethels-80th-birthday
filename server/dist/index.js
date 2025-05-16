"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const body_parser_1 = __importDefault(require("body-parser"));
require("dotenv").config();
const nodemailer = require("nodemailer");
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)({
    origin: "https://nonyeah.github.io",
    methods: ["GET", "POST"],
}));
app.use(body_parser_1.default.json());
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USERNAME,
        pass: process.env.PASSWORD,
    },
});
app.post("/", (req, res) => {
    console.log("Request body:", req.body);
    const { name, email, attending, otherguests } = req.body;
    const [firstName, lastName] = name.split(" ");
    const tempArray = [];
    try {
        const fileData = fs_1.default.readFileSync("invitationList.txt", "utf-8");
        if (fileData) {
            const guestList = JSON.parse(fileData);
            tempArray.push(...guestList);
        }
    }
    catch (err) {
        console.log("No existing file or invalid JSON.");
    }
    tempArray.push(req.body);
    fs_1.default.writeFile("invitationList.txt", JSON.stringify(tempArray, null, 4), (err) => {
        if (err)
            console.log(err);
    });
    if (attending) {
        res.send(`That's awesome ${firstName}, we look forward to seeing you on 1st November!`);
    }
    else {
        res.send(`Awww that's a pity ${firstName}, we're sorry you can't make it.`);
    }
    const mailOptions = {
        from: process.env.USERNAME,
        to: "nonyeulasi@hotmail.com",
        subject: "Guest List",
        text: "80th birthday party RSVP list",
        attachments: [
            {
                filename: "invitationList.txt",
                path: path_1.default.join(__dirname, "invitationList.txt"),
            },
        ],
    };
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.error("Email failed:", error);
        }
        console.log("Email sent:", info.response);
    });
});
app.listen(PORT, () => {
    console.log(`Server running at https://ethels-80th-birthday.onrender.com:${PORT}`);
});
