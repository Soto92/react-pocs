const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());
let meetings = [
  {
    title: "101 with Mauricio",
    date: "2023-12-22T00:00:00.000Z",
    startTime: "11:00",
    endTime: "11:30",
  },
  {
    title: "Daily",
    date: "2023-12-22T00:00:00.000Z",
    startTime: "02:30",
    endTime: "03:00",
  },
];

app.get("/api/meetings", (req, res) => {
  res.json(meetings);
});

app.post("/api/meetings", (req, res) => {
  const { title, date, startTime, endTime } = req.body;

  if (!title || !date || !startTime || !endTime) {
    return res
      .status(400)
      .json({ error: "Invalid request. Missing required fields." });
  }

  const newMeeting = { title, date, startTime, endTime };
  meetings.push(newMeeting);
  res.json(newMeeting);
});

app.delete("/api/meetings/:id", (req, res) => {
  const id = req.params.id;

  if (id < 0 || id >= meetings.length) {
    return res.status(404).json({ error: "Meeting not found." });
  }

  meetings = meetings.filter((meeting, index) => index !== id);
  res.json({ message: "Meeting removed successfully." });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
