import axios from "axios";

import { Meeting } from "./Meeting";
import { User } from "./User";

class MeetingScheduler {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async fetchUsers() {
    try {
      const response = await axios.get(`${this.baseUrl}/users`);
      return response.data.map((userData) => new User(userData));
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  async scheduleMeeting(newMeeting, host, guest) {
    try {
      const hostMeetings = host.meetings;
      const guestMeetings = guest.meetings;
      const meetings = [...hostMeetings, ...guestMeetings];

      if (this.isSlotBusy(meetings, newMeeting)) {
        throw new Error("Host is already scheduled for a meeting this time!");
      }

      const response = await axios.post(`${this.baseUrl}/meetings`, {
        title: newMeeting.title,
        date: newMeeting.date,
        startTime: newMeeting.startTime,
        endTime: newMeeting.endTime,
        attendees: [host.userId, guest.userId],
      });

      const scheduledMeeting = new Meeting(response.data);
      host.meetings.push(scheduledMeeting);
      guest.meetings.push(scheduledMeeting);

      await this.fetchUsers(this.baseUrl);
    } catch (error) {
      throw new Error(`Failed to schedule meeting: ${error.message}`);
    }
  }

  async removeMeeting(meetingId) {
    try {
      await axios.delete(`${this.baseUrl}/meetings/${meetingId}`);
      await this.fetchUsers(this.baseUrl);
    } catch (error) {
      throw new Error(`Failed to remove meeting: ${error.message}`);
    }
  }

  isSlotBusy(meetings, newMeeting) {
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
  }
}

export { MeetingScheduler };
