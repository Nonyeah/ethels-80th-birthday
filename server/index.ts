import express from "express";
import cors from "cors";
import fs from "fs";
import path from "path";
import bodyParser from "body-parser";
require("dotenv").config();
const nodemailer = require("nodemailer");

const app = express();
const PORT = 3000;

app.use(
  cors({
    origin: "https://nonyeah.github.io",
    methods: ["GET", "POST"],
  })
);

app.use(bodyParser.json());

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.USERNAME,
    pass: process.env.PASSWORD,
  },
});

type Data = {
  name: string;
  email: string;
  attending: boolean;
  otherguests: string;
};

app.post("/", (req, res) => {
  console.log("Request body:", req.body);
  const { name, email, attending, otherguests }: Data = req.body;
  const [firstName, lastName] = name.split(" ");

  const tempArray: Array<Data | null> = [];

  try {
    const fileData = fs.readFileSync("invitationList.txt", "utf-8");
    if (fileData) {
      const guestList: Array<Data> = JSON.parse(fileData);
      tempArray.push(...guestList);
    }
  } catch (err) {
    console.log("No existing file or invalid JSON.");
  }

  tempArray.push(req.body);

  fs.writeFile(
    "invitationList.txt",
    JSON.stringify(tempArray, null, 4),
    (err) => {
      if (err) console.log(err);
    }
  );

  if (attending) {
    res.send(
      `That's awesome ${firstName}, we look forward to seeing you on 1st November!`
    );
  } else {
    res.send(`Awww that's a pity ${firstName}, we're sorry you can't make it.`);
  }

  interface MailOptions {
    from: string | undefined;
    to: string;
    subject: string;
    text: string;
    attachments: Attachments[];
  }

  type Attachments = { filename: string; path: string };

  const mailOptions: MailOptions = {
    from: process.env.USERNAME,
    to: "nonyeulasi@hotmail.com",
    subject: "Guest List",
    text: "80th birthday party RSVP list",
    attachments: [
      {
        filename: "invitationList.txt",
        path: path.join(__dirname, "invitationList.txt"),
      },
    ],
  };

  transporter.sendMail(mailOptions, (error: Error, info: any) => {
    if (error) {
      return console.error("Email failed:", error);
    }
    console.log("Email sent:", info.response);
  });
});

app.listen(PORT, () => {
  console.log(
    `Server running at https://ethels-80th-birthday.onrender.com:${PORT}`
  );
});
