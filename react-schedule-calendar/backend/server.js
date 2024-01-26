const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const app = express();
const PORT = 3001;

app.use(bodyParser.json());
app.use(cors());

let meetings = [
  {
    title: "101",
    date: "2024-01-17T00:00:00.000Z",
    startTime: "08:00",
    endTime: "10:30",
    id: "01",
    attendees: ["host-00", "guest-01"],
  },
  {
    title: "Daily",
    date: "2024-01-17T00:00:00.000Z",
    startTime: "02:30",
    endTime: "03:00",
    id: "02",
    attendees: ["host-00", "guest-01"],
  },
  {
    title: "Training - Design Patterns",
    date: "2024-01-17T00:00:00.000Z",
    startTime: "03:30",
    endTime: "06:00",
    id: "03",
    attendees: ["host-xx", "guest-01"],
  },
  {
    title: "Training - QA",
    date: "2024-01-17T00:00:00.000Z",
    startTime: "06:30",
    endTime: "17:00",
    id: "04",
    attendees: ["guest-04", "guest-02"],
  },
];

const guidGenerator = () => Date.now().toString();

const refreshUsers = () => [
  {
    name: "Mauricio",
    meetings: meetings.filter((m) => m.attendees.includes("host-00")),
    userId: "host-00",
  },
  {
    name: "John",
    meetings: meetings.filter((m) => m.attendees.includes("guest-01")),
    userId: "guest-01",
  },
  {
    name: "Gohan",
    meetings: meetings.filter((m) => m.attendees.includes("guest-02")),
    userId: "guest-02",
  },
];

app.get("/api/users", (req, res) => {
  res.json(refreshUsers());
});

app.post("/api/meetings", (req, res) => {
  const { title, date, startTime, endTime, attendees } = req.body;

  if (!title || !date || !startTime || !endTime) {
    return res
      .status(400)
      .json({ error: "Invalid request. Missing required fields." });
  }

  const newMeeting = {
    title,
    date,
    startTime,
    endTime,
    attendees,
    id: guidGenerator(),
  };
  meetings.push(newMeeting);

  refreshUsers();
  res.json(newMeeting);
});

app.delete("/api/meetings/:id", (req, res) => {
  const id = req.params.id;

  if (id.length === 0) {
    return res.status(404).json({ error: "Meeting not found." });
  }

  meetings = meetings.filter((meeting) => meeting.id !== id);
  refreshUsers();
  res.json({ message: "Meeting removed successfully." });
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
