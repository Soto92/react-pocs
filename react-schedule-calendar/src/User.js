import Meeting from "./Meeting";

class User {
  constructor(userData) {
    this.userId = userData.id;
    this.username = userData.username;
    this.meetings = userData.meetings.map(
      (meetingData) => new Meeting(meetingData)
    );
  }
}

export { User };
