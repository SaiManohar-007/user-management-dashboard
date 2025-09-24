
# User Management App
## Here is the URL : https://user-management-by-manohar.netlify.app/


A simple **React + Vite** web application to manage users, featuring **view, add, edit, delete, filter, pagination, and sorting** functionalities. The app uses **JSONPlaceholder** as a mock backend API.

---

## **Features**

- Display a paginated table of users with **ID, First Name, Last Name, Email, Department**
- Add a new user (simulated with JSONPlaceholder)
- Edit an existing user
- Delete a user
- **Filter / search** users by first name, last name, email, and department
- **Sort** users by any column (ascending / descending)
- **Pagination** with configurable page size (10, 25, 50, 100)
- Responsive layout with Tailwind CSS
- Loading and action feedback for add/edit/delete

---

## **Project Structure**


```
user-management-app/
├─ public/
│   └─ index.html
├─ src/
│   ├─ api/
│   │   └─ api.js                 # Axios API functions for CRUD operations
│   ├─ components/
│   │   ├─ UserList.jsx            # User table with actions and sorting
│   │   ├─ UserForm.jsx            # Add/Edit user form
│   │   ├─ Pagination.jsx          # Pagination component
│   │   └─ FilterPopup.jsx         # Filter/Search popup
│   ├─ hooks/
│   │   └─ useUserData.js          # Custom hook: data, pagination, filter, sort, actions
│   ├─ App.jsx                      # Main application file
│   ├─ main.jsx                     # Entry point for React Vite
│   └─ index.css                    # Tailwind / global CSS
├─ package.json
├─ vite.config.js
└─ README.md
```


---

## **Setup Instructions**

1. **Clone the repository**
```
git clone https://github.com/SaiManohar-007/user-management-dashboard
cd user-management-dashboard
```

2.**Install dependencies**
```
npm install
```

3.**Run the app**
```
npm run dev
```

4.**Open the app in your browser:**
```
http://localhost:5173
```
