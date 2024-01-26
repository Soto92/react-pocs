/**
(4) Build a Calendar system (book meetings, remove meetings, listMeetings, suggest best time for 2 people)
https://github.com/diegopacheco/tech-resources/blob/master/react-native-resources.md#ooad-challenges-round-2
 */

import React, { useEffect, useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import "./App.css";
import { MeetingScheduler } from "./MeetingsScheduleManager";
import { ApiManager } from "./Service";
import { findAvailableTimeSlots, generateTimeOptions } from "./utils";

function App() {
  const backendURL = "http://localhost:3001/api";
  const apiManager = new ApiManager(backendURL);
  const meetingScheduler = new MeetingScheduler(apiManager);

  const [host, setHost] = useState({});
  const [guest, setGuest] = useState({});
  const [users, setUsers] = useState({});
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
    await meetingScheduler
      .fetchUsers()
      .then((response) => {
        const allUsers = response;
        const firstElement = allUsers.shift();
        setHost(firstElement);
        setUsers(allUsers);
      })
      .catch((error) => setError(error.message));
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAddMeeting = async () => {
    await meetingScheduler
      .scheduleMeeting(newMeeting, host, guest)
      .then(() => fetchUsers())
      .catch((e) => setError(e.message));
  };

  const handleDateChange = (date) => {
    setNewMeeting({ ...newMeeting, date });
    updateSuggestions(date);
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
              <button
                onClick={() =>
                  meetingScheduler
                    .removeMeeting(meeting.id)
                    .then(() => {
                      fetchUsers();
                    })
                    .catch((error) => setError(error.message))
                }
              >
                Remove
              </button>
            </li>
          ))}

          <p>Guest meetings:</p>
          <label>Users:</label>
          <select
            value={`${guest.userId}`}
            onChange={(e) => {
              const user = users?.find((el) => el.userId === e.target.value);
              setGuest(user);
            }}
          >
            {users.length > 0 &&
              users?.map((user, index) => {
                return (
                  <option key={index} value={`${user.userId}`}>
                    {user.name}
                  </option>
                );
              })}
          </select>
          {guest?.meetings?.map((meeting, index) => (
            <li key={index}>
              {meeting.title} - {meeting.date} {meeting.startTime} to{" "}
              {meeting.endTime}
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
