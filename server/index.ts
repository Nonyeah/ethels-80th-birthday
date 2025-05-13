import express from 'express';
import path from 'path';
import fs from 'fs';
import cors from 'cors';

//shape of objects contained in the guest list array
interface Data {
    name: string,
    email: string,
    other: number,
    attending: boolean
}


const app = express();
const PORT = 3000;
app.use(cors());

// Middleware to parse URL-encoded form data
app.use(express.urlencoded({ extended: true }));
app.use(express.json()); // to parse JSON requests


// Handle form submission
app.post('/guestList', (req, res) => {
  console.log("Request body:", req.body);
  const { name, email, attending, guests } = req.body;
  const [firstName, lastName] = name.split(" ");
  const tempArray: Array<Data | null> = [];
  const fileData = fs.readFileSync("invitationList.txt");
  if (fileData) {
    const dataObj = JSON.parse(JSON.stringify(fileData));
    tempArray.push(dataObj);
    tempArray.push(req.body);
    fs.writeFile(
      "invitationList.txt",
      JSON.stringify(tempArray, null, 4),
      (err) => {
        if (err) console.log(err);
      }
    );
  } else {
    tempArray.push(req.body);
    fs.appendFile(
      "invitationList.txt",
      JSON.stringify(tempArray, null, 4),
      (err) => {
        if (err) console.log(err);
      }
    );
}

  if(attending){
    res.send(`That's awesome ${firstName} we look forward to seeing you on 1st November`)
  } else{
  res.send(`Awww that's a pity ${firstName} we're sorry you can't make it`);
  };


app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
})
