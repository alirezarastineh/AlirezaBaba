import axios from "axios";

const apiClient = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:4000/"
      : "https://alireza-baba-server.vercel.app/",
  headers: {
    "Content-type": "application/json",
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    const userInfoString = localStorage.getItem("userInfo");

    if (userInfoString) {
      const userInfo = JSON.parse(userInfoString);
      if (userInfo.token) {
        config.headers.authorization = `Bearer ${userInfo.token}`;
      }
    }

    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default apiClient;
