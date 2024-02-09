import ServiceAPI from "../ServiceApi/serviceApi";

class MeetingService {
  constructor() {
    this.serviceAPI = new ServiceAPI();
  }

  async addMeeting(meetingData) {
    try {
      const response = await this.serviceAPI("POST", `/meetings`, meetingData);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add meeting: ${error.message}`);
    }
  }
  async removeMeeting(meetingId) {
    try {
      await this.serviceAPI("DELETE", `/meetings/${meetingId}`);
    } catch (error) {
      throw new Error(`Failed to remove meeting: ${error.message}`);
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
      await this.addMeeting({
        title: newMeeting.title,
        date: newMeeting.date,
        startTime: newMeeting.startTime,
        endTime: newMeeting.endTime,
        attendees: [host.userId, guest.userId],
      });
    } catch (error) {
      throw new Error(`Failed to schedule meeting: ${error.message}`);
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

export default MeetingService;
