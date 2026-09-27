import axios from "axios";

export const clientAxios = axios.create({
    baseURL: "https://localhost:5000/api"
});
