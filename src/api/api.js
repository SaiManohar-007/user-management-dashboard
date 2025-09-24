//   src/api/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "https://jsonplaceholder.typicode.com",
  timeout: 10000,
});

//fetch all users
export async function getUsers() {
  const res = await api.get("/users");
  return res.data;
}

// fetch single user by id
export async function getUser(id) {
  const res = await api.get(`/users/${id}`);
  return res.data;
}

//add a neww user
export async function createUser(user) {
  const res = await api.post("/users", user);
  return res.data;
}

//update a user
export async function updateUser(id, user) {
  const res = await api.put(`/users/${id}`, user);
  return res.data;
}

//delete a user
export async function deleteUser(id) {
  const res = await api.delete(`/users/${id}`);
  return res.data;
}
