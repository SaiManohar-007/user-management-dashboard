import React, { useState } from "react";
import useUserData from "./hooks/useUserData";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";
import Pagination from "./components/Pagination";
import FilterPopup from "./components/FilterPopup";

export default function App() {
  const {
    users,
    loading,
    error,
    action,
    addUser,
    editUser,
    removeUser,
    totalUsers,
    currentPage,
    pageSize,
    changePage,
    changePageSize,
    filters,
    setFilter,
  } = useUserData();

  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  function handleAddClick() {
    setEditingUser(null);
    setShowForm(true);
  }

  function handleEditClick(user) {
    setEditingUser(user);
    setShowForm(true);
  }

  async function handleSubmit(form) {
    if (editingUser) {
      await editUser(editingUser.id, form);
    } else {
      await addUser(form);
    }
    setShowForm(false);
    setEditingUser(null);
  }

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4 text-center">user management</h1>

      {/* Filter & Add buttons */}
      <div className="mb-4 flex space-x-2">
        <button
          onClick={() => setShowFilter(true)}
          className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
        >
          filter / search
        </button>
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          add user
        </button>
      </div>

      {/* Filter Popup */}
      <FilterPopup
        isOpen={showFilter}
        onClose={() => setShowFilter(false)}
        onApply={setFilter}
        initialFilters={filters}
      />

      {/* Loading / error / action messages */}
      {loading && <p className="text-blue-500 mb-2">loading users...</p>}
      {error && <p className="text-red-500 mb-2">{error}</p>}
      {action && (
        <p className="text-blue-600 mb-2">
          {action === "adding" && "adding user..."}
          {action === "editing" && "updating user..."}
          {action === "deleting" && "removing user..."}
        </p>
      )}

      {/* User Form */}
      {showForm && (
        <div className="mb-6">
          <UserForm
            initialData={editingUser}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* User Table */}
      <UserList users={users} onEdit={handleEditClick} onDelete={removeUser} />

      {/* Pagination */}
      <Pagination
        totalUsers={totalUsers}
        currentPage={currentPage}
        pageSize={pageSize}
        changePage={changePage}
        changePageSize={changePageSize}
      />
    </div>
  );
}
