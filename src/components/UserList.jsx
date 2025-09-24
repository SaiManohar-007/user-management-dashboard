import React from "react";

export default function UserList({
  users,
  onEdit,
  onDelete,
  sortField,
  sortOrder,
  sortBy,
  isLoading = false
}) {
  if (isLoading) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center p-8">
            <div className="animate-pulse">Loading users...</div>
          </div>
        </div>
      </div>
    );
  }

  if (!users.length) {
    return (
      <div className="card">
        <div className="card-body">
          <div className="text-center p-8">
            <div className="text-gray-500 text-lg mb-2">No users found</div>
            <p className="text-gray-400">Try adjusting your filters or add a new user.</p>
          </div>
        </div>
      </div>
    );
  }

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <span className="text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity">↕</span>;
    }
    return sortOrder === "asc" ? (
      <span className="text-primary-600">↑</span>
    ) : (
      <span className="text-primary-600">↓</span>
    );
  };

  const TableHeader = ({ label, field, width = "auto" }) => (
    <th
      className={`p-4 text-left font-semibold text-gray-700 bg-gray-50 cursor-pointer group transition-colors hover:bg-gray-100`}
      style={{ width }}
      onClick={() => sortBy(field)}
      aria-sort={sortField === field ? (sortOrder === "asc" ? "ascending" : "descending") : "none"}
      role="columnheader"
      title={`Sort by ${label}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-gray-900">{label}</span>
        <SortIcon field={field} />
      </div>
    </th>
  );

  return (
    <div className="card">
      <div className="table-container">
        <table className="table" role="table" aria-label="Users list">
          <thead>
            <tr>
              <TableHeader label="ID" field="id" width="80px" />
              <TableHeader label="First Name" field="firstName" width="120px" />
              <TableHeader label="Last Name" field="lastName" width="120px" />
              <TableHeader label="Email" field="email" width="200px" />
              <TableHeader label="Department" field="department" width="150px" />
              <th 
                className="p-4 text-center font-semibold text-gray-700 bg-gray-50"
                style={{ width: "140px" }}
                role="columnheader"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {users.map((user, index) => (
              <tr 
                key={user.id} 
                className="border-b border-gray-100 last:border-b-0 hover:bg-gray-50 transition-colors"
              >
                <td className="p-4 text-sm text-gray-600 font-mono">{user.id}</td>
                <td className="p-4 text-sm text-gray-900 font-medium">{user.firstName}</td>
                <td className="p-4 text-sm text-gray-900">{user.lastName}</td>
                <td className="p-4 text-sm text-gray-600">
                  <a 
                    href={`mailto:${user.email}`}
                    className="text-primary-600 hover:text-primary-700 transition-colors"
                  >
                    {user.email}
                  </a>
                </td>
                <td className="p-4 text-sm text-gray-600">
                  {user.department || (
                    <span className="text-gray-400 italic">Not specified</span>
                  )}
                </td>
                <td className="p-4">
                  <div className="flex items-center justify-center gap-2">
                    <button
                      className="btn btn-primary btn-sm"
                      onClick={() => onEdit(user)}
                      aria-label={`Edit ${user.firstName} ${user.lastName}`}
                      title="Edit user"
                    >Edit 
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                      </svg>
                    </button>
                    <button
                      className="btn btn-danger btn-sm"
                      onClick={() => onDelete(user.id)}
                      aria-label={`Delete ${user.firstName} ${user.lastName}`}
                      title="Delete user"
                    >Delete
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}