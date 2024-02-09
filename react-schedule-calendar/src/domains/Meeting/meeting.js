class Meeting {
  constructor(data) {
    this.title = data.title;
    this.date = data.date;
    this.startTime = data.startTime;
    this.endTime = data.endTime;
    this.id = data.id;
    this.attendees = data.attendees;
  }
}

export default Meeting;
