import ServiceAPI from "../ServiceApi/serviceApi";
import User from "./user";

class UserService {
  constructor() {
    this.serviceAPI = new ServiceAPI();
  }
  async fetchUsers() {
    try {
      const response = await this.serviceAPI.fetchApi("GET", "/users");
      return response.data.map((userData) => new User(userData));
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }
}

export default UserService;
