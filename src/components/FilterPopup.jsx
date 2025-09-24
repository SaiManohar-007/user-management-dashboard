import React, { useEffect, useRef, useState } from "react";

export default function FilterPopup({
  isOpen,
  onClose,
  onApply,
  initialFilters,
}) {
  const [filters, setFilters] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });

  const [errors, setErrors] = useState({});
  const backdropRef = useRef(null);
  const dialogRef = useRef(null);
  const firstFieldRef = useRef(null);
  const closeBtnRef = useRef(null);
  const openerRef = useRef(null);

  useEffect(() => {
    if (!isOpen) return;
    
    openerRef.current = document.activeElement;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const timeoutId = setTimeout(() => {
      if (firstFieldRef.current) {
        firstFieldRef.current.focus();
      } else if (dialogRef.current) {
        dialogRef.current.focus();
      }
    }, 10);

    function handleKeyDown(e) {
      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
        return;
      }
      
      if (e.key === "Tab" && dialogRef.current) {
        const focusableSelectors = [
          'button:not([disabled])',
          '[href]',
          'input:not([disabled])',
          'select:not([disabled])',
          'textarea:not([disabled])',
          '[tabindex]:not([tabindex="-1"])'
        ].join(', ');
        
        const focusables = dialogRef.current.querySelectorAll(focusableSelectors);
        const list = Array.from(focusables).filter(el => 
          el.offsetParent !== null && 
          !el.getAttribute('aria-hidden')
        );
        
        if (list.length === 0) return;
        
        const first = list[0];
        const last = list[list.length - 1];
        
        if (!dialogRef.current.contains(document.activeElement)) {
          first.focus();
          e.preventDefault();
          return;
        }
        
        if (e.shiftKey && document.activeElement === first) {
          last.focus();
          e.preventDefault();
        } else if (!e.shiftKey && document.activeElement === last) {
          first.focus();
          e.preventDefault();
        }
      }
    }

    document.addEventListener("keydown", handleKeyDown);

    return () => {
      clearTimeout(timeoutId);
      document.body.style.overflow = prevOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      
      if (openerRef.current?.focus) {
        openerRef.current.focus();
      }
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (initialFilters && isOpen) {
      setFilters(initialFilters);
      setErrors({});
    }
  }, [initialFilters, isOpen]);

  const validateField = (name, value) => {
    if (value.length > 50) {
      return `${name.replace(/([A-Z])/g, " $1")} filter is too long`;
    }
    return "";
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    const error = validateField(name, value);
    if (error) {
      setErrors(prev => ({ ...prev, [name]: error }));
    }
  };

  const handleApply = () => {
    // Validate all fields
    const newErrors = {};
    Object.keys(filters).forEach(key => {
      const error = validateField(key, filters[key]);
      if (error) newErrors[key] = error;
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    onApply(filters);
    onClose();
  };

  const handleReset = () => {
    const emptyFilters = { firstName: "", lastName: "", email: "", department: "" };
    setFilters(emptyFilters);
    setErrors({});
    onApply(emptyFilters);
    onClose();
  };

  const handleBackdropClick = (e) => {
    if (e.target === backdropRef.current) {
      onClose();
    }
  };

  const hasActiveFilters = Object.values(filters).some(value => value.trim() !== "");

  if (!isOpen) return null;

  const fieldConfig = [
    { 
      key: "firstName", 
      label: "First Name", 
      placeholder: "e.g. Ramesh",
      type: "text"
    },
    { 
      key: "lastName", 
      label: "Last Name", 
      placeholder: "e.g. Kumar",
      type: "text"
    },
    { 
      key: "email", 
      label: "Email Address", 
      placeholder: "e.g. name@example.com",
      type: "email"
    },
    { 
      key: "department", 
      label: "Department", 
      placeholder: "e.g. Engineering",
      type: "text"
    }
  ];

  return (
    <div
      ref={backdropRef}
      className="modal-overlay"
      onMouseDown={handleBackdropClick}
    >
      <div
        ref={dialogRef}
        className="modal-content animate-in"
        role="dialog"
        aria-modal="true"
        aria-labelledby="filter-dialog-title"
        aria-describedby="filter-dialog-description"
        tabIndex={-1}
      >
        <div className="modal-header">
          <div>
            <h2 id="filter-dialog-title" className="modal-title">
              Filter Users
            </h2>
            <p id="filter-dialog-description" className="text-gray-600 text-sm mt-1">
              {hasActiveFilters ? "Active filters applied" : "Refine your user search"}
            </p>
          </div>
          <button
            ref={closeBtnRef}
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close filter dialog"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="modal-body">
          <div className="space-y-4">
            {fieldConfig.map((field, index) => (
              <div key={field.key} className="form-field">
                <label htmlFor={`filter-${field.key}`} className="form-label">
                  {field.label}
                </label>
                <input
                  id={`filter-${field.key}`}
                  ref={index === 0 ? firstFieldRef : null}
                  type={field.type}
                  name={field.key}
                  value={filters[field.key]}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  className={`form-input ${errors[field.key] ? 'border-error-500' : ''}`}
                  placeholder={field.placeholder}
                  aria-describedby={errors[field.key] ? `error-${field.key}` : undefined}
                />
                {errors[field.key] && (
                  <div id={`error-${field.key}`} className="form-error">
                    {errors[field.key]}
                  </div>
                )}
              </div>
            ))}
          </div>

          {hasActiveFilters && (
            <div className="mt-4 p-3 bg-primary-50 border border-primary-200 rounded-lg">
              <div className="flex items-center gap-2 text-sm text-primary-800">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>Filters are active. Reset to clear all filters.</span>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={handleReset}
            disabled={!hasActiveFilters}
          >
            Reset All
          </button>
          <div className="flex gap-3">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleApply}
            >
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}