import React from "react";

export default function UserList({ users, onEdit, onDelete }) {
  if (!users.length) return <p className="text-center mt-4">no users found</p>;

  return (
    <div className="overflow-x-auto">
      <table className="w-full border border-gray-200 text-sm">
        <thead className="bg-gray-100">
          <tr>
            <th className="border px-3 py-2 text-left">ID</th>
            <th className="border px-3 py-2 text-left">First Name</th>
            <th className="border px-3 py-2 text-left">Last Name</th>
            <th className="border px-3 py-2 text-left">Email</th>
            <th className="border px-3 py-2 text-left">Department</th>
            <th className="border px-3 py-2 text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((u) => (
            <tr key={u.id}>
              <td className="border px-3 py-2">{u.id}</td>
              <td className="border px-3 py-2">{u.firstName}</td>
              <td className="border px-3 py-2">{u.lastName}</td>
              <td className="border px-3 py-2">{u.email}</td>
              <td className="border px-3 py-2">{u.department}</td>
              <td className="border px-3 py-2 space-x-2 text-center">
                <button
                  onClick={() => onEdit(u)}
                  className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  edit
                </button>
                <button
                  onClick={() => onDelete(u.id)}
                  className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
                >
                  delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
