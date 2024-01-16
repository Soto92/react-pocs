/**
(4) Build a Calendar system (book meetings, remove meetings, listMeetings, suggest best time for 2 people)
https://github.com/diegopacheco/tech-resources/blob/master/react-native-resources.md#ooad-challenges-round-2
 */

import axios from "axios";
import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import { findAvailableTimeSlots } from "./utils";

function App() {
  const backendURL = "http://localhost:3001/api";
  const [host, setHost] = useState({});
  const [guest, setGuest] = useState({});
  const [suggestions, setSuggestions] = useState([]);

  const [newMeeting, setNewMeeting] = useState({
    title: "",
    date: new Date(),
    startTime: "",
    endTime: "",
    attendees: [],
  });
  const [error, setError] = useState(null);

  const updateSuggestions = (date) => {
    const hostMeetings = host.meetings;
    const guestMeetings = guest.meetings;
    const meetings = [...hostMeetings, ...guestMeetings];
    setSuggestions(findAvailableTimeSlots(meetings, date));
  };

  const fetchUsers = async () => {
    await axios
      .get(`${backendURL}/users`)
      .then((response) => {
        setHost(response.data[0]);
        setGuest(response.data[1]);
      })
      .catch((error) => setError(error.message));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const isSlotBusy = (meetings, newMeeting) => {
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

    const hostMeetings = host.meetings;
    const guestMeetings = guest.meetings;
    const meetings = [...hostMeetings, ...guestMeetings];
    if (isSlotBusy(meetings, newMeeting)) {
      setError("Host is already scheduled for a meeting this time!");
      return;
    }
    axios
      .post(`${backendURL}/meetings`, {
        title,
        date,
        startTime,
        endTime,
        attendees: [host.userId, guest.userId],
      })
      .then(() => {
        fetchUsers();
        setNewMeeting({
          title: "",
          date: null,
          startTime: "",
          endTime: "",
          attendees: [],
        });
      })
      .catch((error) => setError(error.message));
  };

  const handleRemoveMeeting = (id) => {
    axios
      .delete(`${backendURL}/meetings/${id}`)
      .then((response) => {
        fetchUsers();
      })
      .catch((error) => setError(error.message));
  };

  const handleDateChange = (date) => {
    setNewMeeting({ ...newMeeting, date });
    updateSuggestions(date);
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
          <p>Your meetings:</p>
          {host?.meetings?.map((meeting, index) => (
            <li key={index}>
              {meeting.title} - {meeting.date} {meeting.startTime} to{" "}
              {meeting.endTime}
              <button onClick={() => handleRemoveMeeting(meeting.id)}>
                Remove
              </button>
            </li>
          ))}

          <p>Guest meetings:</p>
          {guest?.meetings?.map((meeting, index) => (
            <li key={index}>
              {meeting.title} - {meeting.date} {meeting.startTime} to{" "}
              {meeting.endTime}
              <button onClick={() => handleRemoveMeeting(meeting.id)}>
                Remove
              </button>
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
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 400,
            alignSelf: "auto",
          }}
        >
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

          <label>Suggestions:</label>
          <select
            value={`${newMeeting.startTime}-${newMeeting.endTime}`}
            onChange={(e) => {
              const [startTime, endTime] = e.target.value.split("-");
              setNewMeeting({
                ...newMeeting,
                endTime,
                startTime,
              });
            }}
          >
            {suggestions.map((s, index) => {
              return (
                <option key={index} value={`${s.start}-${s.end}`}>
                  {s.start} - {s.end}
                </option>
              );
            })}
          </select>
        </div>

        <button onClick={handleAddMeeting}>Add Meeting</button>
      </div>
    </div>
  );
}

export default App;
