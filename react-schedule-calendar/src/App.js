/**
(4) Build a Calendar system (book meetings, remove meetings, listMeetings, suggest best time for 2 people)
https://github.com/diegopacheco/tech-resources/blob/master/react-native-resources.md#ooad-challenges-round-2
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";

function App() {
  const backendURL = "http://localhost:3001/api";
  const [meetings, setMeetings] = useState([]);
  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: new Date(),
    startTime: "",
    endTime: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`${backendURL}/meetings`)
      .then((response) => {
        setMeetings(response.data);
      })
      .catch((error) => setError(error.message));
  }, []);

  const isHostScheduled = (meetings, newMeeting) => {
    const targetDate = new Date(newMeeting.date).toISOString().split("T")[0];
    return meetings.some(
      (meeting) =>
        new Date(meeting.date).toISOString().split("T")[0] === targetDate &&
        ((meeting.startTime >= newMeeting.startTime &&
          meeting.startTime < newMeeting.endTime) ||
          (meeting.endTime > newMeeting.startTime &&
            meeting.endTime <= newMeeting.endTime) ||
          (meeting.startTime <= newMeeting.startTime &&
            meeting.endTime >= newMeeting.endTime))
    );
  };

  const handleAddMeeting = () => {
    const { title, date, startTime, endTime } = newMeeting;

    if (isHostScheduled(meetings, newMeeting)) {
      setError("Host is already scheduled for a meeting this time!");
      return;
    }
    axios
      .post(`${backendURL}/meetings`, { title, date, startTime, endTime })
      .then((response) => {
        setMeetings([...meetings, response.data]);
        setNewMeeting({ title: "", date: null, startTime: "", endTime: "" });
      })
      .catch((error) => setError(error.message));
  };

  const handleRemoveMeeting = (id) => {
    axios
      .delete(`${backendURL}/meetings/${id}`)
      .then((response) => {
        setMeetings(meetings.filter((meeting, index) => index !== id));
      })
      .catch((error) => setError(error.message));
  };

  const handleDateChange = (date) => {
    console.log({ date });
    setNewMeeting({ ...newMeeting, date });
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let i = 0; i < 24; i++) {
      for (let j = 0; j < 60; j += 30) {
        const hour = i < 10 ? `0${i}` : `${i}`;
        const minute = j === 0 ? "00" : "30";
        options.push(`${hour}:${minute}`);
      }
    }
    return options;
  };

  return (
    <div className="App">
      <h1>Calendar App</h1>
      {error && (
        <p style={{ fontWeight: "bold", color: "red" }}>Error: {error}</p>
      )}
      <div>
        <h2>Scheduled Meetings</h2>
        <ul>
          {meetings.map((meeting, index) => (
            <li key={index}>
              {meeting.title} - {meeting.date} {meeting.startTime} to{" "}
              {meeting.endTime}
              <button onClick={() => handleRemoveMeeting(index)}>Remove</button>
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h2>Add Meeting</h2>
        <input
          type="text"
          placeholder="Title"
          value={newMeeting.title}
          onChange={(e) =>
            setNewMeeting({ ...newMeeting, title: e.target.value })
          }
        />
        <Calendar value={newMeeting.date} onChange={handleDateChange} />

        <label>Start Time:</label>
        <select
          value={newMeeting.startTime}
          onChange={(e) =>
            setNewMeeting({ ...newMeeting, startTime: e.target.value })
          }
        >
          {generateTimeOptions().map((time, index) => (
            <option key={index} value={time}>
              {newMeeting.date ? `${newMeeting.date} ${time}` : time}
            </option>
          ))}
        </select>

        <label>End Time:</label>
        <select
          value={newMeeting.endTime}
          onChange={(e) =>
            setNewMeeting({ ...newMeeting, endTime: e.target.value })
          }
        >
          {generateTimeOptions().map((time, index) => (
            <option key={index} value={time}>
              {newMeeting.date ? `${newMeeting.date} ${time}` : time}
            </option>
          ))}
        </select>

        <button onClick={handleAddMeeting}>Add Meeting</button>
      </div>
    </div>
  );
}

export default App;
