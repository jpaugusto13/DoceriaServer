import axios from "axios";

const chatbot = axios.create({
  baseURL: "http://localhost:8068"
});

export default chatbot;