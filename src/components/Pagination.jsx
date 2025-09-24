import React from "react";

export default function Pagination({
  totalUsers,
  currentPage,
  pageSize,
  changePage,
  changePageSize,
}) {
  const totalPages = Math.ceil(totalUsers / pageSize);
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="flex items-center justify-between mt-4">
      <div>
        <span>show </span>
        <select
          value={pageSize}
          onChange={(e) => changePageSize(Number(e.target.value))}
          className="border px-2 py-1 rounded"
        >
          {[10, 25, 50, 100].map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <span> entries</span>
      </div>
      <div className="space-x-1">
        {pageNumbers.map((num) => (
          <button
            key={num}
            onClick={() => changePage(num)}
            className={`px-3 py-1 rounded ${
              num === currentPage ? "bg-blue-600 text-white" : "bg-gray-200"
            }`}
          >
            {num}
          </button>
        ))}
      </div>
    </div>
  );
}
