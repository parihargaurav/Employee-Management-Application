// Import necessary dependencies and components
import  { useEffect, useState } from 'react';
import EmployeeTable from './EmployeeTable'; // Table to display all employees
import AddEmployee from './AddEmployee';     // Modal component for adding/updating employees
import { GetAllEmployees } from '../api'; // API functions
import { ToastContainer } from 'react-toastify'; // For toast notifications


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
            currentPage: 1,    // currently visible page
            pageSize: 5,       // number of employees per page
            totalEmployees: 0, // total count of employees
            totalPages: 0      // number of pages
        }
    });

    // -------------------- FETCH EMPLOYEES FUNCTION --------------------
    // Fetches employees from backend with optional search, page, and limit
    const fetchEmployees = async (search = '', page = 1, limit = 5) => {
        console.log('Called fetchEmployees');
        try {
            // Call the API to get employees
            const data = await GetAllEmployees(search, page, limit);

            console.log(data);

            // Update the local state with fetched employee data
            setEmployeesData(data);
        } catch (err) {
            // Show an alert in case of API failure
            alert('Error', err);
        }
    };

    // -------------------- USE EFFECT (COMPONENT MOUNT) --------------------
    // This useEffect runs once after the component mounts (like componentDidMount)
    // It fetches the initial list of employees when the app loads.
    useEffect(() => {
        fetchEmployees();
    }, []); // Empty dependency array => runs only once when component mounts


    // -------------------- SEARCH HANDLER --------------------
    // Called whenever user types in the search bar
    // Fetches filtered employee data based on search input
    const handleSearch = (e) => {
        fetchEmployees(e.target.value);
    };

    // -------------------- UPDATE EMPLOYEE HANDLER --------------------
    // When user clicks "Edit" on an employee, open modal with that employee’s data
    const handleUpdateEmployee = async (emp) => {
        setEmployeeObj(emp);     // store employee data in state
        setShowModal(true);      // show modal for editing
    };

    // -------------------- COMPONENT JSX --------------------
    return (
        <div className='d-flex flex-column justify-content-center align-items-center w-100 p-3'>
            {/* Page Title */}
            <h1>Employee Management App</h1>

            {/* Centered container for content */}
            <div className='w-100 d-flex justify-content-center'>
                <div className='w-80 border bg-light p-3' style={{ width: '80%' }}>
                    
                    {/* Top section with Add button and Search bar */}
                    <div className='d-flex justify-content-between mb-3'>
                        {/* Button to open Add Employee modal */}
                        <button
                            className='btn btn-primary'
                            onClick={() => setShowModal(true)}
                        >
                            Add
                        </button>

                        {/* Search input box */}
                        <input
                            onChange={handleSearch} // triggers fetch on typing
                            type="text"
                            placeholder="Search Employees..."
                            className='form-control w-50'
                        />
                    </div>

                    {/* Table to display employees list */}
                    <EmployeeTable
                        employees={employeesData.employees}       // employee array
                        pagination={employeesData.pagination}      // pagination info
                        fetchEmployees={fetchEmployees}            // passed for re-fetching
                        handleUpdateEmployee={handleUpdateEmployee} // passed for editing
                    />

                    {/* Add / Update employee modal */}
                    <AddEmployee
                        fetchEmployees={fetchEmployees}  // passed to refresh list after add/update
                        showModal={showModal}            // modal visibility
                        setShowModal={setShowModal}      // to close modal
                        employeeObj={employeeObj}        // employee being edited (null = add)
                    />
                </div>
            </div>

            {/* Toast container for success/error notifications */}
            <ToastContainer
                position='top-right'
                autoClose={3000}
                hideProgressBar={false}
            />
        </div>
    );
};

// Export the component as default
export default EmployeeManagementApp;
