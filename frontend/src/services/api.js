import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000"
});

export const createComplaint = (data) => API.post("/complaints", data);
export const getComplaints = () => API.get("/complaints");
export const updateComplaint = (id, data) => API.put(`/complaints/${id}`, data);
export const deleteComplaint = (id) => API.delete(`/complaints/${id}`);

export default API;