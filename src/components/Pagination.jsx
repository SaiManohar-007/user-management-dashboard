import React from "react";

export default function Pagination({
  totalUsers,
  currentPage,
  pageSize,
  changePage,
  changePageSize,
  isLoading = false
}) {
  const totalPages = Math.ceil(totalUsers / pageSize);
  
  if (totalPages <= 1 && pageSize === 10) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    // Adjust if we're near the end
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalUsers);

  const PaginationButton = ({ children, onClick, disabled, active, ariaLabel, className = "" }) => (
    <button
      onClick={onClick}
      disabled={disabled || isLoading}
      aria-label={ariaLabel}
      className={`
        btn btn-sm min-w-[40px] h-10 px-3 font-medium transition-all duration-200
        ${active ? 'btn-primary' : 'btn-secondary'}
        ${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-md'}
        ${className}
      `}
    >
      {children}
    </button>
  );

  return (
    <nav 
      className="flex flex-col lg:flex-row items-center justify-between gap-6 p-6 border-t border-gray-200 bg-gray-50"
      aria-label="Pagination navigation"
    >
      {/* Page Size Selector */}
      <div className="flex items-center gap-3">
        <span className="text-sm text-gray-600 whitespace-nowrap">Show</span>
        <select
          value={pageSize}
          onChange={(e) => changePageSize(Number(e.target.value))}
          disabled={isLoading}
          className="form-input w-20 text-center"
          aria-label="Items per page"
        >
          {[10, 25, 50, 100].map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
        <span className="text-sm text-gray-600 whitespace-nowrap">per page</span>
      </div>

      {/* Results Info */}
      <div className="text-sm text-gray-600">
        Showing <span className="font-semibold text-gray-900">{startItem}</span> to{" "}
        <span className="font-semibold text-gray-900">{endItem}</span> of{" "}
        <span className="font-semibold text-gray-900">{totalUsers.toLocaleString()}</span> results
      </div>

      {/* Page Navigation */}
      {totalPages > 1 && (
        <div className="flex items-center gap-2">
          {/* First Page */}
          <PaginationButton
            onClick={() => changePage(1)}
            disabled={currentPage === 1}
            ariaLabel="Go to first page"
            className="hidden sm:inline-flex"
          >
            «
          </PaginationButton>

          {/* Previous Page */}
          <PaginationButton
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 1}
            ariaLabel="Go to previous page"
          >
            ‹
          </PaginationButton>

          {/* Page Numbers */}
          <div className="flex items-center gap-1">
            {pageNumbers[0] > 1 && (
              <>
                <PaginationButton
                  onClick={() => changePage(1)}
                  ariaLabel={`Go to page 1`}
                >
                  1
                </PaginationButton>
                {pageNumbers[0] > 2 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
              </>
            )}
            
            {pageNumbers.map((page) => (
              <PaginationButton
                key={page}
                onClick={() => changePage(page)}
                active={page === currentPage}
                ariaLabel={`Go to page ${page}`}
                aria-current={page === currentPage ? "page" : undefined}
              >
                {page}
              </PaginationButton>
            ))}
            
            {pageNumbers[pageNumbers.length - 1] < totalPages && (
              <>
                {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
                  <span className="px-2 text-gray-400">...</span>
                )}
                <PaginationButton
                  onClick={() => changePage(totalPages)}
                  ariaLabel={`Go to page ${totalPages}`}
                >
                  {totalPages}
                </PaginationButton>
              </>
            )}
          </div>

          {/* Next Page */}
          <PaginationButton
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages}
            ariaLabel="Go to next page"
          >
            ›
          </PaginationButton>

          {/* Last Page */}
          <PaginationButton
            onClick={() => changePage(totalPages)}
            disabled={currentPage === totalPages}
            ariaLabel="Go to last page"
            className="hidden sm:inline-flex"
          >
            »
          </PaginationButton>
        </div>
      )}
    </nav>
  );
}