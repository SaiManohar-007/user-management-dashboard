// src/hooks/useUserData.js
import { useState, useEffect } from "react";
import * as api from "../api/api";

export default function useUserData() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // new state for action status
  const [action, setAction] = useState(null); // "adding" | "editing" | "deleting" | null

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUsers();
      const mapped = data.map((u) => {
        const tokens = (u.name || "").split(" ");
        const firstName = tokens[0] || "";
        const lastName = tokens.slice(1).join(" ") || "";
        return {
          id: u.id,
          firstName,
          lastName,
          email: u.email || "",
          department: (u.company && u.company.name) || "",
        };
      });
      setUsers(mapped);
    } catch (err) {
      setError(err.message || "failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  async function addUser(user) {
    setAction("adding");
    try {
      const payload = {
        name: `${user.firstName} ${user.lastName}`.trim(),
        email: user.email,
        company: { name: user.department },
      };
      const res = await api.createUser(payload);
      const created = { id: res.id || Date.now(), ...user };
      setUsers((prev) => [created, ...prev]);
      return created;
    } finally {
      setAction(null);
    }
  }

  async function editUser(id, updated) {
    setAction("editing");
    try {
      const payload = {
        name: `${updated.firstName} ${updated.lastName}`.trim(),
        email: updated.email,
        company: { name: updated.department },
      };
      await api.updateUser(id, payload);
      setUsers((prev) =>
        prev.map((u) => (u.id === id ? { ...u, ...updated } : u))
      );
    } finally {
      setAction(null);
    }
  }

  async function removeUser(id) {
    setAction("deleting");
    try {
      await api.deleteUser(id);
      setUsers((prev) => prev.filter((u) => u.id !== id));
    } finally {
      setAction(null);
    }
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    action, // expose action state
    fetchUsers,
    addUser,
    editUser,
    removeUser,
  };
}
