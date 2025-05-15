import express from 'express';
import cors from 'cors';
import fs from 'fs';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

app.use(cors({
  origin: 'https://nonyeah.github.io/ethels-80th-birthday/',
  methods: ['GET', 'POST'],
}));

app.use(bodyParser.json());

type Data = {
  name: string;
  email: string;
  attending: boolean;
  otherguests: string;
};

app.post('/', (req, res) => {
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
    res.send(`That's awesome ${firstName}, we look forward to seeing you on 1st November!`);
  } else {
    res.send(`Awww that's a pity ${firstName}, we're sorry you can't make it.`);
  }
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});

