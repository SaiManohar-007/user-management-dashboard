import { useState, useEffect } from "react";
import * as api from "../api/api";

export default function useUserData() {
  const [allUsers, setAllUsers] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [action, setAction] = useState(null);

  // pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [totalUsers, setTotalUsers] = useState(0);

  // filters
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  // search
  const [searchTerm, setSearchTerm] = useState("");

  // sorting
  const [sortField, setSortField] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // asc or desc

  // Apply search across all fields
  function applySearch(data) {
    if (!searchTerm.trim()) return data;
    
    const term = searchTerm.toLowerCase().trim();
    return data.filter((user) => {
      const searchableFields = [
        user.firstName || "",
        user.lastName || "",
        user.email || "",
        user.department || "",
        user.id?.toString() || ""
      ];
      
      return searchableFields.some(field => 
        field.toLowerCase().includes(term)
      );
    });
  }

  function applyFilters(data) {
    return data.filter((u) => {
      return (
        u.firstName.toLowerCase().includes(filters.firstName.toLowerCase()) &&
        u.lastName.toLowerCase().includes(filters.lastName.toLowerCase()) &&
        u.email.toLowerCase().includes(filters.email.toLowerCase()) &&
        u.department.toLowerCase().includes(filters.department.toLowerCase())
      );
    });
  }

  function applySorting(data) {
    if (!sortField) return data;
    const sorted = [...data].sort((a, b) => {
      let aValue = a[sortField] || "";
      let bValue = b[sortField] || "";

      if (typeof aValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }

  function applyPagination(fullList, page, size) {
    const sorted = applySorting(fullList);
    const start = (page - 1) * size;
    const end = start + size;
    setUsers(sorted.slice(start, end));
  }

  // Update data processing pipeline
  function processData() {
    let processedData = [...allUsers];
    
    // Apply search first
    processedData = applySearch(processedData);
    
    // Then apply filters
    processedData = applyFilters(processedData);
    
    // Update total count
    setTotalUsers(processedData.length);
    
    // Apply pagination
    applyPagination(processedData, currentPage, pageSize);
  }

  function setFilter(newFilters) {
    setFilters(newFilters);
    setCurrentPage(1);
  }

  function setSearch(term) {
    setSearchTerm(term);
    setCurrentPage(1);
  }

  function clearSearch() {
    setSearchTerm("");
    setCurrentPage(1);
  }

  function sortBy(field) {
    if (sortField === field) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortOrder("asc");
    }
  }

  function changePage(page) {
    setCurrentPage(page);
  }

  function changePageSize(size) {
    setPageSize(size);
    setCurrentPage(1);
  }

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
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        company: { name: user.department },
      };
      const res = await api.createUser(payload);
      const created = { id: res.id || Date.now(), ...user };
      const updatedAll = [created, ...allUsers];
      setAllUsers(updatedAll);
      return created;
    } finally {
      setAction(null);
    }
  }

  async function editUser(id, updated) {
    setAction("editing");
    try {
      const payload = {
        name: `${updated.firstName} ${updated.lastName}`,
        email: updated.email,
        company: { name: updated.department },
      };
      await api.updateUser(id, payload);
      const updatedAll = allUsers.map((u) => (u.id === id ? { ...u, ...updated } : u));
      setAllUsers(updatedAll);
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
    } finally {
      setAction(null);
    }
  }

  // Process data whenever dependencies change
  useEffect(() => {
    processData();
  }, [allUsers, filters, searchTerm, sortField, sortOrder, currentPage, pageSize]);

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
    filters,
    setFilter,
    searchTerm,
    setSearch,
    clearSearch,
    sortField,
    sortOrder,
    sortBy,
    addUser,
    editUser,
    removeUser,
  };
}