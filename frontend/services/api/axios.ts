import "dotenv/config";
import axios from "axios";
import { toast } from "react-hot-toast";
import { getCookie } from "@/lib/cookie";
import config from "../../config/config.json";

const userInstance = axios.create({
  baseURL: config.API_BASE_URL,
  headers: {
    "Content-type": "application/json",
    language: "en",
  },
});

userInstance.interceptors.request.use(async (config) => {
  const token: any = getCookie("token");
  if (token) {
    config.headers.Authorization = "Bearer " + JSON.parse(token);
  }
  return config;
});

userInstance.interceptors.response.use(
  function (response) {
    if (response.config.method !== "get") {
      notifySuccess(response);
    }
    return response?.data;
  },
  async function (error) {
    // Do something with response error
    let err = error?.response?.data?.errorMessage || "internal error";
    if (error.response.status === 401) {
      document.location.replace("/auth/login");
    } else {
      if (error.response.status !== 404) {
        notify(err);
      }
    }

    return Promise.reject(error);
  }
);

const notify = (error: any) => {
  toast.error(error);
};

const notifySuccess = (response: any) => {
  toast.success(response.data.message);
};
export default userInstance;
