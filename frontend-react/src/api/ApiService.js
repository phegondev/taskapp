import axios from "axios";

export default class ApiService {

    static API_URL = "http://18.221.161.43:3030/api"


    static saveToken(token) {
        localStorage.setItem("token", token)
    }

    static getToken() {
        return localStorage.getItem("token")
    }

    static isAthenticated() {
        return !!localStorage.getItem("token");
    }
    static logout() {
        localStorage.removeItem("token")
    }

    static getHeader() {
        const token = this.getToken();
        return {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    }


    //Register USER
    static async registerUser(body) {
        const resp = await axios.post(`${this.API_URL}/auth/register`, body);
        return resp.data;
    }

    //Login USER
    static async loginUser(body) {
        const resp = await axios.post(`${this.API_URL}/auth/login`, body);
        return resp.data;
    }



  //TASKS API
  static async createTask(body) {
    const resp = await axios.post(`${this.API_URL}/tasks`, body, {
      headers: this.getHeader()
    });
    return resp.data;
  }


  static async updateTask(body) {
    const resp = await axios.put(`${this.API_URL}/tasks`, body, {
      headers: this.getHeader()
    });
    return resp.data;
  }


  static async getAllMyTasks() {
    const resp = await axios.get(`${this.API_URL}/tasks`, {
      headers: this.getHeader(),
    });
    return resp.data;
  }


  static async getTaskById(taskId) {
    const resp = await axios.get(`${this.API_URL}/tasks/${taskId}`, {
      headers: this.getHeader()
    });
    return resp.data;
  }


  static async deleteTask(taskId) {
    const resp = await axios.delete(`${this.API_URL}/tasks/${taskId}`, {
      headers: this.getHeader()
    });
    return resp.data;
  }


  static async getMyTasksByCompletionStatus(completed) {
    const resp = await axios.get(`${this.API_URL}/tasks/status`, {
      headers: this.getHeader(),
      params: {
        completed: completed
      }
    });
    return resp.data;
  }

  static async getMyTasksByPriority(priority) {
    const resp = await axios.get(`${this.API_URL}/tasks/priority`, {
      headers: this.getHeader(),
      params: {
        priority: priority
      }
    });
    return resp.data;
  }



}