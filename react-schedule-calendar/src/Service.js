import axios from "axios";

class ApiManager {
  constructor(baseUrl) {
    this.baseUrl = baseUrl;
  }

  async getUsers() {
    try {
      const response = await axios.get(`${this.baseUrl}/users`);
      return response.data;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  async addMeeting(meetingData) {
    try {
      const response = await axios.post(
        `${this.baseUrl}/meetings`,
        meetingData
      );
      return response.data;
    } catch (error) {
      throw new Error(`Failed to add meeting: ${error.message}`);
    }
  }

  async removeMeeting(meetingId) {
    try {
      await axios.delete(`${this.baseUrl}/meetings/${meetingId}`);
    } catch (error) {
      throw new Error(`Failed to remove meeting: ${error.message}`);
    }
  }
}

export { ApiManager };
