// Import necessary dependencies and components
import { useEffect, useState } from "react";
import EmployeeTable from "./EmployeeTable"; // Table to display all employees
import AddEmployee from "./AddEmployee"; // Modal component for adding/updating employees
import { GetAllEmployees } from "../api"; // API functions
import { ToastContainer } from "react-toastify"; // For toast notifications

// Main functional component for the Employee Management App
const EmployeeManagementApp = () => {
  // -------------------- STATE VARIABLES --------------------
  // Controls whether Add/Edit modal is visible
  const [showModal, setShowModal] = useState(false);

  // Holds the employee object that we want to edit (null = adding a new employee)
  const [employeeObj, setEmployeeObj] = useState(null);

  // Stores employee list + pagination data (default: empty)
  const [employeesData, setEmployeesData] = useState({
    employees: [], // array of employee objects
    pagination: {
      currentPage: 1, // currently visible page
      pageSize: 5, // number of employees per page
      totalEmployees: 0, // total count of employees
      totalPages: 0, // number of pages
    },
  });

  // -------------------- FETCH EMPLOYEES FUNCTION --------------------
  // Fetches employees from backend with optional search, page, and limit
  const fetchEmployees = async (search = "", page = 1, limit = 5) => {
    try {
      // Call the API to get employees
      const data = await GetAllEmployees(search, page, limit);
      // Update the local state with fetched employee data
      setEmployeesData(data);
    } catch (err) {
      // Show an alert in case of API failure
      alert("Error", err);
    }
  };

  // -------------------- USE EFFECT (COMPONENT MOUNT) --------------------
  useEffect(() => {
    fetchEmployees();
  }, []); // Empty dependency array => runs only once when component mounts

  // -------------------- SEARCH HANDLER --------------------
  const handleSearch = (e) => {
    fetchEmployees(e.target.value);
  };

  // -------------------- UPDATE EMPLOYEE HANDLER --------------------
  const handleUpdateEmployee = async (emp) => {
    setEmployeeObj(emp); // store employee data in state
    setShowModal(true); // show modal for editing
  };

  // -------------------- INLINE STYLES --------------------
  const containerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    padding: '2rem',
    background: 'linear-gradient(135deg, #93eb80ff 0%, #ffb3d9 100%)',
    minHeight: '100vh'
  };

  const titleStyle = {
    fontStyle: 'italic',
    fontWeight: 'bold',
    fontSize: '2.5rem',
    color: '#2d6ba1',
    marginBottom: '2rem',
    textShadow: '2px 2px 4px rgba(0, 0, 0, 0.1)',
    textAlign: 'center'
  };

  const contentWrapperStyle = {
    width: '100%',
    display: 'flex',
    justifyContent: 'center'
  };

  const mainCardStyle = {
    width: '90%',
    maxWidth: '1200px',
    background: 'linear-gradient(to bottom, #ffffff, #f8f9fa)',
    border: '2px solid #2d6ba1',
    borderRadius: '15px',
    padding: '2rem',
    boxShadow: '0 8px 24px rgba(45, 107, 161, 0.3)'
  };

  const actionBarStyle = {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '1.5rem',
    gap: '1rem',
    flexWrap: 'wrap'
  };

  const addButtonStyle = {
    padding: '0.6rem 1.5rem',
    fontWeight: '600',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(40, 167, 69, 0.3)',
    transition: 'all 0.3s ease',
    border: 'none',
    background: '#28a745',
    color: 'white',
    cursor: 'pointer'
  };

  const searchInputStyle = {
    maxWidth: '400px',
    border: '2px solid #2d6ba1',
    borderRadius: '8px',
    padding: '0.6rem 1rem',
    transition: 'all 0.3s ease'
  };

  // -------------------- COMPONENT JSX --------------------
  return (
    <div style={containerStyle}>
      {/* Page Title */}
      <h1 style={titleStyle}>
        Employee Management Desk
      </h1>

      {/* Centered container for content */}
      <div style={contentWrapperStyle}>
        <div style={mainCardStyle}>
          {/* Top section with Add button and Search bar */}
          <div style={actionBarStyle}>
            {/* Button to open Add Employee modal */}
            <button
              className="btn btn-success"
              style={addButtonStyle}
              onClick={() => setShowModal(true)}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 12px rgba(40, 167, 69, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 8px rgba(40, 167, 69, 0.3)';
              }}
            >
              ➕ Add Employee
            </button>

            {/* Search input box */}
            <input
              onChange={handleSearch}
              type="text"
              placeholder="🔍 Search Employees..."
              className="form-control"
              style={searchInputStyle}
              onFocus={(e) => {
                e.target.style.borderColor = '#1e4d7b';
                e.target.style.boxShadow = '0 0 0 0.2rem rgba(45, 107, 161, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#2d6ba1';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>

          {/* Table to display employees list */}
          <EmployeeTable
            employees={employeesData.employees}
            pagination={employeesData.pagination}
            fetchEmployees={fetchEmployees}
            handleUpdateEmployee={handleUpdateEmployee}
          />

          {/* Add / Update employee modal */}
          <AddEmployee
            fetchEmployees={fetchEmployees}
            showModal={showModal}
            setShowModal={setShowModal}
            employeeObj={employeeObj}
          />
        </div>
      </div>

      {/* Toast container for success/error notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
      />
    </div>
  );
};

// Export the component as default
export default EmployeeManagementApp;