import axios from "axios";
const DB_URL=import.meta.env.VITE_DB_URL;
const instance=axios.create({
    baseURL:DB_URL || "http://localhost:8000/api/v1",
    withCredentials: true,
})
export default instance
