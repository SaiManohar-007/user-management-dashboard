// src/components/FilterPopup.jsx
import React, { useState, useEffect } from "react";

export default function FilterPopup({ isOpen, onClose, onApply, initialFilters }) {
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  useEffect(() => {
    if (initialFilters) setFilters(initialFilters);
  }, [initialFilters]);

  if (!isOpen) return null;

  function handleChange(e) {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  }

  function handleApply() {
    onApply(filters);
    onClose();
  }

  function handleReset() {
    setFilters({ firstName: "", lastName: "", email: "", department: "" });
    onApply({ firstName: "", lastName: "", email: "", department: "" });
    onClose();
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded shadow-md w-96">
        <h2 className="text-lg font-bold mb-4">Filter Users</h2>

        {["firstName", "lastName", "email", "department"].map((field) => (
          <div key={field} className="mb-3">
            <label className="block mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</label>
            <input
              type="text"
              name={field}
              value={filters[field]}
              onChange={handleChange}
              className="w-full border px-2 py-1 rounded"
            />
          </div>
        ))}

        <div className="flex justify-end space-x-2 mt-4">
          <button
            onClick={handleReset}
            className="px-3 py-1 bg-gray-400 text-white rounded hover:bg-gray-500"
          >
            reset
          </button>
          <button
            onClick={handleApply}
            className="px-3 py-1 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            apply
          </button>
        </div>
      </div>
    </div>
  );
}
