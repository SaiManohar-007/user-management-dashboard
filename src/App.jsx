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
    searchTerm,
    setSearch,
    clearSearch,
    sortField,
    sortOrder,
    sortBy,
  } = useUserData();

  const [editingUser, setEditingUser] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [showFilter, setShowFilter] = useState(false);

  const handleAddClick = () => {
    setEditingUser(null);
    setShowForm(true);
  };

  const handleEditClick = (user) => {
    setEditingUser(user);
    setShowForm(true);
  };

  const handleSubmit = async (formData) => {
    try {
      if (editingUser) {
        await editUser(editingUser.id, formData);
      } else {
        await addUser(formData);
      }
      setShowForm(false);
      setEditingUser(null);
    } catch (error) {
      console.error('Form submission error:', error);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingUser(null);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleClearSearch = () => {
    clearSearch();
  };

  const isActionInProgress = action === "adding" || action === "editing" || action === "deleting";
  const isFormDisabled = loading || isActionInProgress;
  const hasActiveSearch = searchTerm.trim() !== "";

  return (
    <div className="app-container">
      <header className="app-header">
        <div className="container">
          <h1>User Management System</h1>
          <p className="text-primary-100 text-lg mt-2">
            Manage your team members efficiently
          </p>
        </div>
      </header>

      <main className="app-main">
        <div className="container">
          {/* Search Bar */}
          <div className="card mb-6">
            <div className="card-body">
              <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="flex-1 w-full">
                  <label htmlFor="search-users" className="form-label sr-only">
                    Search users
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      {/* <svg className="h-3 w-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg> */}
                    </div>
                    <input
                      id="search-users"
                      type="text"
                      value={searchTerm}
                      onChange={handleSearchChange}
                      className="form-input pl-10 pr-10"
                      placeholder="Search users by name, email, department, or ID..."
                      disabled={isFormDisabled}
                    />
                    {hasActiveSearch && (
                      <button
                        type="button"
                        onClick={handleClearSearch}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                        aria-label="Clear search"
                      >
                        <svg className="h-4 w-4 text-gray-400 hover:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-3 flex-shrink-0">
                  <button
                    onClick={() => setShowFilter(true)}
                    className="btn btn-secondary"
                    disabled={isFormDisabled}
                    aria-disabled={isFormDisabled}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                    </svg>
                    Filter & Search
                  </button>
                  
                  <button
                    onClick={handleAddClick}
                    className="btn btn-primary"
                    disabled={isFormDisabled}
                    aria-disabled={isFormDisabled}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    Add User
                  </button>
                </div>
              </div>

              {/* Search Results Info */}
              {hasActiveSearch && (
                <div className="mt-3 flex items-center gap-2 text-sm text-gray-600">
                  <span>
                    Found {totalUsers} result{totalUsers !== 1 ? 's' : ''} for "{searchTerm}"
                  </span>
                  <button
                    onClick={handleClearSearch}
                    className="text-primary-600 hover:text-primary-700 font-medium"
                  >
                    Clear search
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Status Messages */}
          {(loading || error || action) && (
            <div className="mb-6">
              <div 
                className={`p-4 rounded-lg ${
                  error ? 'bg-error-50 border border-error-200' : 
                  loading || action ? 'bg-primary-50 border border-primary-200' : ''
                }`}
                role="status"
                aria-live="polite"
              >
                <div className="flex items-center gap-3">
                  {(loading || action) && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-primary-600 border-t-transparent"></div>
                  )}
                  <span className={`text-sm font-medium ${
                    error ? 'text-error-800' : 'text-primary-800'
                  }`}>
                    {loading && "Loading users..."}
                    {error && `Error: ${error}`}
                    {action === "adding" && "Adding new user..."}
                    {action === "editing" && "Updating user information..."}
                    {action === "deleting" && "Removing user..."}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* User Form */}
          {showForm && (
            <div className="mb-6 animate-in">
              <UserForm
                initialData={editingUser}
                onSubmit={handleSubmit}
                onCancel={handleCancel}
                title={editingUser ? "Edit User" : "Add New User"}
                submitText={editingUser ? "Update User" : "Add User"}
              />
            </div>
          )}

          {/* Filter Popup */}
          <FilterPopup
            isOpen={showFilter}
            onClose={() => setShowFilter(false)}
            onApply={setFilter}
            initialFilters={filters}
          />

          {/* Users List */}
          <div className="mb-6">
            <UserList
              users={users}
              onEdit={handleEditClick}
              onDelete={removeUser}
              sortField={sortField}
              sortOrder={sortOrder}
              sortBy={sortBy}
              isLoading={loading}
            />
          </div>

          {/* Pagination */}
          {totalUsers > 0 && (
            <div className="flex justify-center">
              <Pagination
                totalUsers={totalUsers}
                currentPage={currentPage}
                pageSize={pageSize}
                changePage={changePage}
                changePageSize={changePageSize}
                isLoading={loading}
              />
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t border-gray-200 py-6 mt-auto">
        <div className="container">
          <div className="text-center text-gray-600 text-sm">
            <p>User Management System © 2024</p>
          </div>
        </div>
      </footer>
    </div>
  );
}