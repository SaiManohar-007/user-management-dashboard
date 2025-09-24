// src/App.jsx this is the main application file where everything comes together.
import React, { useState } from "react";
import useUserData from "./hooks/useUserData";
import UserList from "./components/UserList";
import UserForm from "./components/UserForm";

export default function App() {
  const { users, loading, error, action, addUser, editUser, removeUser } =
    useUserData();
  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

      {/* initial fetch loading */}
      {loading && <p className="text-blue-500 mb-2">loading users...</p>}

      {/* error */}
      {error && <p className="text-red-500 mb-2">{error}</p>}

      {/* action-specific loading */}
      {action && (
        <p className="text-blue-600 mb-2">
          {action === "adding" && "adding user..."}
          {action === "editing" && "updating user..."}
          {action === "deleting" && "removing user..."}
        </p>
      )}

      {/* Add User button */}
      <div className="mb-4">
        <button
          onClick={handleAddClick}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          add user
        </button>
      </div>

      {/* User form for add/edit */}
      {showForm && (
        <div className="mb-6">
          <UserForm
            initialData={editingUser}
            onSubmit={handleSubmit}
            onCancel={() => setShowForm(false)}
          />
        </div>
      )}

      {/* User table */}
      <UserList
        users={users}
        onEdit={handleEditClick}
        onDelete={removeUser}
      />
    </div>
  );
}
