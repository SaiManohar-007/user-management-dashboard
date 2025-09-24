import React, { useState, useEffect } from "react";

const trim = (v) => v?.trim() || "";

export default function UserForm({ initialData, onSubmit, onCancel, title = "User Details", submitText = "Save" }) {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    department: "",
  });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    if (initialData) {
      setForm({ ...initialData });
    }
  }, [initialData]);

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  }

  function handleBlur(e) {
    const { name } = e.target;
    setTouched(prev => ({ ...prev, [name]: true }));
    validateField(name, form[name]);
  }

  function validateField(name, value) {
    let error = "";
    
    switch (name) {
      case "firstName":
        if (!trim(value)) error = "First name is required";
        else if (value.length < 2) error = "First name must be at least 2 characters";
        break;
      case "email":
        if (!trim(value)) error = "Email is required";
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) error = "Please enter a valid email address";
        break;
      case "department":
        if (value.length > 50) error = "Department name is too long";
        break;
      default:
        break;
    }
    
    setErrors(prev => ({ ...prev, [name]: error }));
    return !error;
  }

  function validateForm() {
    const newErrors = {};
    let isValid = true;

    if (!trim(form.firstName)) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!trim(form.email)) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    
    // Mark all fields as touched
    setTouched({
      firstName: true,
      lastName: true,
      email: true,
      department: true,
    });

    if (!validateForm()) {
      return;
    }

    const cleanedData = {
      ...form,
      firstName: trim(form.firstName),
      lastName: trim(form.lastName),
      email: trim(form.email).toLowerCase(),
      department: trim(form.department),
    };

    try {
      await onSubmit(cleanedData);
      // Reset form only if not editing
      if (!initialData) {
        setForm({ firstName: "", lastName: "", email: "", department: "" });
        setTouched({});
      }
      setErrors({});
    } catch (error) {
      // Handle submission error (e.g., duplicate email)
      setErrors({ submit: error.message || "Failed to save user" });
    }
  }

  const getFieldError = (name) => {
    return touched[name] ? errors[name] : "";
  };

  return (
    <div className="card animate-in">
      <div className="card-header">
        <h2 className="card-title mb-0">{title}</h2>
      </div>
      
      <form onSubmit={handleSubmit} aria-label="User form">
        <div className="card-body">
          <div className="form-grid">
            <div className="form-field">
              <label htmlFor="firstName" className="form-label required">
                First Name
              </label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className={`form-input ${getFieldError("firstName") ? "error" : ""}`}
                value={form.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter first name"
                aria-describedby={getFieldError("firstName") ? "firstName-error" : undefined}
              />
              {getFieldError("firstName") && (
                <div id="firstName-error" className="form-error">
                  {getFieldError("firstName")}
                </div>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="lastName" className="form-label">
                Last Name
              </label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="form-input"
                value={form.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter last name"
              />
            </div>

            <div className="form-field">
              <label htmlFor="email" className="form-label required">
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                className={`form-input ${getFieldError("email") ? "error" : ""}`}
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter email address"
                aria-describedby={getFieldError("email") ? "email-error" : undefined}
              />
              {getFieldError("email") && (
                <div id="email-error" className="form-error">
                  {getFieldError("email")}
                </div>
              )}
            </div>

            <div className="form-field">
              <label htmlFor="department" className="form-label">
                Department
              </label>
              <input
                id="department"
                name="department"
                type="text"
                className="form-input"
                value={form.department}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter department"
              />
            </div>
          </div>

          {errors.submit && (
            <div className="form-error mt-4" role="alert">
              {errors.submit}
            </div>
          )}
        </div>

        <div className="card-footer">
          <div className="flex gap-4 justify-end">
            {onCancel && (
              <button
                type="button"
                className="btn btn-secondary"
                onClick={onCancel}
              >
                Cancel
              </button>
            )}
            <button
              type="submit"
              className="btn btn-primary"
            >
              {submitText}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}