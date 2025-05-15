"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const body_parser_1 = __importDefault(require("body-parser"));
const app = (0, express_1.default)();
const PORT = 3000;
app.use((0, cors_1.default)({
    origin: 'https://nonyeah.github.io/ethels-80th-birthday/'
}));
app.use(body_parser_1.default.json());
app.post('/', (req, res) => {
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
});
app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
