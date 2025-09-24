// src/components/UserForm.jsx
import React, { useState, useEffect } from "react";

export default function UserForm({ initialData, onSubmit, onCancel }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    if (initialData) setForm({ ...initialData });
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(e) {
    e.preventDefault();
    if (!form.firstName.trim() || !form.email.trim()) {
      alert("first name and email are required");
      return;
    }
    onSubmit(form);
    setForm({ firstName: "", lastName: "", email: "", department: "" });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 bg-gray-50 p-4 rounded shadow">
      <div>
        <label className="block mb-1">First Name</label>
        <input
          type="text"
          name="firstName"
          value={form.firstName}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Last Name</label>
        <input
          type="text"
          name="lastName"
          value={form.lastName}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div>
        <label className="block mb-1">Email</label>
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>

      <div>
        <label className="block mb-1">Department</label>
        <input
          type="text"
          name="department"
          value={form.department}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        />
      </div>

      <div className="flex space-x-2">
        <button
          type="submit"
          className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
        >
          save
        </button>
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            cancel
          </button>
        )}
      </div>
    </form>
  );
}
// This component provides a form for adding or editing user details, with fields for first name, last name, email, and department. It handles form state and validation, and calls the provided onSubmit and onCancel callbacks as needed.