import axios from "axios";
import { BASE_URL} from "./apiPaths";

const axiosInstace = axios.create({
    baseURL: BASE_URL,
    timeout: 10000, //10s
    headers: {
        "Content-Type": "application/json", //trimit date json
        Accept: "application/json", //astept sa primesc tot json
    },
});

axiosInstace.interceptors.request.use(
    (config) => {
        const accessTocken = localStorage.getItem("token");
        if (accessTocken) {
            config.headers.Authorization = `Bearer ${accessTocken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

axiosInstace.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        //globally errors
        if (error.response) {
            if (error.response.status === 401) {
                window.location.href = "/login";
            } else if (error.response.status === 500) {
                console.error("Server error. Please try again later.");
            }
        } else if (error.code === "ECONNABORTED") {
            console.error("Request timeout. Please try again.");
        }
        return Promise.reject(error);
    }
);

export default axiosInstace
