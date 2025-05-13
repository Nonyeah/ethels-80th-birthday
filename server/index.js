"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var fs_1 = require("fs");
var cors_1 = require("cors");
var app = (0, express_1.default)();
var PORT = 3000;
app.use((0, cors_1.default)());
app.use((0, cors_1.default)({
    origin: 'http://localhost:5173'
}));
// Middleware to parse URL-encoded form data
app.use(express_1.default.urlencoded({ extended: true }));
app.use(express_1.default.json()); // to parse JSON requests
// Handle form submission
app.post('http://localhost:5173', function (req, res) {
    console.log("Request body:", req.body);
    var _a = req.body, name = _a.name, email = _a.email, attending = _a.attending, otherGuests = _a.otherGuests;
    var _b = name.split(" "), firstName = _b[0], lastName = _b[1];
    var tempArray = [];
    var fileData = fs_1.default.readFileSync("invitationList.txt");
    if (fileData) {
        var dataObj = JSON.parse(JSON.stringify(fileData));
        tempArray.push(dataObj);
        tempArray.push(req.body);
        fs_1.default.writeFile("invitationList.txt", JSON.stringify(tempArray, null, 4), function (err) {
            if (err)
                console.log(err);
        });
    }
    else {
        tempArray.push(req.body);
        fs_1.default.writeFile("invitationList.txt", JSON.stringify(tempArray, null, 4), function (err) {
            if (err)
                console.log(err);
        });
    }
    if (attending) {
        res.send("That's awesome ".concat(firstName, " we look forward to seeing you on 1st November"));
    }
    else {
        res.send("Awww that's a pity ".concat(firstName, " we're sorry you can't make it"));
    }
    ;
    app.listen(PORT, function () {
        console.log("Server running at http://localhost:".concat(PORT));
    });
});
