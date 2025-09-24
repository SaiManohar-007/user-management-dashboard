// src/hooks/useUserData.js
import { useState, useEffect } from "react";
import * as api from "../api/api";

export default function useUserData() {
  const [allUsers, setAllUsers] = useState([]); // full dataset
  const [users, setUsers] = useState([]); // paginated view
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [action, setAction] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  async function fetchUsers() {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getUsers();
      const mapped = data.map((u) => {
        const tokens = (u.name || "").split(" ");
        return {
          id: u.id,
          firstName: tokens[0] || "",
          lastName: tokens.slice(1).join(" ") || "",
          email: u.email || "",
          department: (u.company && u.company.name) || "",
        };
      });
      setAllUsers(mapped);
      setTotalUsers(mapped.length);
      applyPagination(mapped, currentPage, pageSize);
    } catch (err) {
      setError(err.message || "failed to fetch users");
    } finally {
      setLoading(false);
    }
  }

  function applyPagination(fullList, page, size) {
    const start = (page - 1) * size;
    const end = start + size;
    setUsers(fullList.slice(start, end));
  }

  function changePage(page) {
    setCurrentPage(page);
    applyPagination(allUsers, page, pageSize);
  }

  function changePageSize(size) {
    setPageSize(size);
    setCurrentPage(1);
    applyPagination(allUsers, 1, size);
  }

  async function addUser(user) {
    setAction("adding");
    try {
      const payload = { name: `${user.firstName} ${user.lastName}`, email: user.email, company: { name: user.department } };
      const res = await api.createUser(payload);
      const created = { id: res.id || Date.now(), ...user };
      const updatedAll = [created, ...allUsers];
      setAllUsers(updatedAll);
      setTotalUsers(updatedAll.length);
      applyPagination(updatedAll, currentPage, pageSize);
      return created;
    } finally {
      setAction(null);
    }
  }

  async function editUser(id, updated) {
    setAction("editing");
    try {
      const payload = { name: `${updated.firstName} ${updated.lastName}`, email: updated.email, company: { name: updated.department } };
      await api.updateUser(id, payload);
      const updatedAll = allUsers.map((u) => (u.id === id ? { ...u, ...updated } : u));
      setAllUsers(updatedAll);
      applyPagination(updatedAll, currentPage, pageSize);
    } finally {
      setAction(null);
    }
  }

  async function removeUser(id) {
    setAction("deleting");
    try {
      await api.deleteUser(id);
      const updatedAll = allUsers.filter((u) => u.id !== id);
      setAllUsers(updatedAll);
      setTotalUsers(updatedAll.length);
      applyPagination(updatedAll, currentPage, pageSize);
    } finally {
      setAction(null);
    }
  }

  useEffect(() => {
    fetchUsers();
    // eslint-disable-next-line
  }, []);

  return {
    users,
    loading,
    error,
    action,
    totalUsers,
    currentPage,
    pageSize,
    changePage,
    changePageSize,
    addUser,
    editUser,
    removeUser,
  };
}
