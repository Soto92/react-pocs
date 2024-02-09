import axios from "axios";

class ServiceAPI {
  constructor() {
    this.apiURL = "http://localhost:3001/api";
  }

  async fetchApi(method, path, options) {
    try {
      const response = await axios({
        method: method,
        url: `${this.apiURL}${path}`,
        ...options,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching api:", error);
      return [];
    }
  }
}

export default ServiceAPI;
