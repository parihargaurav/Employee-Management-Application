// Import necessary dependencies
import { Link } from "react-router-dom"; // For navigation (to employee detail page)
import { DeleteEmployeeById } from "../api"; // API function to delete an employee
import { notify } from "../utils"; // Utility for showing toast notifications

// EmployeeTable Component
function EmployeeTable({
  employees, // Array of employee objects to display
  pagination, // Object containing pagination data (currentPage, totalPages)
  fetchEmployees, // Function to re-fetch employee list (used after delete or pagination)
  handleUpdateEmployee, // Function to handle editing employee (passed from parent)
}) {
  // Table column headers
  const headers = ["Name", "Email", "Phone", "Department", "Actions"];

  // Destructure pagination values
  const { currentPage, totalPages } = pagination;

  /* -------------------- Pagination Handlers -------------------- */

  // Go to next page (if not already on last page)
  const handleNextPage = () => {
    if (currentPage < totalPages) {
      handlePagination(currentPage + 1);
    }
  };

  // Go to previous page (if not already on first page)
  const handlePreviousPage = () => {
    if (currentPage > 1) {
      handlePagination(currentPage - 1);
    }
  };

  // Main function to handle page change (calls API)
  const handlePagination = (currentPage) => {
    // Fetch employees for the selected page (5 items per page)
    fetchEmployees("", currentPage, 5);
  };

  /* -------------------- Delete Employee Handler -------------------- */
  const handleDeleteEmployee = async (id) => {
    try {
      // Call API to delete employee by ID
      const { success, message } = await DeleteEmployeeById(id);

      // Show success or error notification
      if (success) {
        notify(message, "success");
      } else {
        notify(message, "error");
      }

      // Refresh employee list after deletion
      fetchEmployees();
    } catch (err) {
      console.error(err);
      notify("Failed to delete Employee", "error");
    }
  };

  /* -------------------- Table Row Component -------------------- */
  // Inner component for rendering a single employee row
  const TableRow = ({ employee }) => {
    return (
      <tr>
        {/* Employee name links to detailed view */}
        <td>
          <Link
            to={`/employee/${employee._id}`}
            className="text-decoration-none"
          >
            {employee.name}
          </Link>
        </td>

        {/* Display employee details */}
        <td>{employee.email}</td>
        <td>{employee.phone}</td>
        <td>{employee.department}</td>

        {/* Action buttons (Edit and Delete) */}
        <td>
          {/* Edit icon */}
          <i
            className="bi bi-pencil-fill text-warning me-4"
            role="button"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Edit"
            // When clicked, call parent handler with employee data
            onClick={() => handleUpdateEmployee(employee)}
          ></i>

          {/* Delete icon */}
          <i
            className="bi bi-trash-fill text-danger"
            role="button"
            data-bs-toggle="tooltip"
            data-bs-placement="top"
            title="Delete"
            // When clicked, call delete function
            onClick={() => handleDeleteEmployee(employee._id)}
          ></i>
        </td>
      </tr>
    );
  };

  /* -------------------- Pagination Button Numbers -------------------- */
  // Create an array of page numbers [1, 2, 3, ... totalPages]
  const pageNumbers = Array.from(
    { length: totalPages },
    (_, index) => index + 1
  );

  /* -------------------- Table Rendering -------------------- */
  return (
    <>
      {/* Employee Data Table */}
      <table className="table table-striped">
        <thead>
          <tr>
            {/* Render table headers dynamically */}
            {headers.map((header, i) => (
              <th key={i}>{header}</th>
            ))}
          </tr>
        </thead>

        <tbody>
          {/* If no employees found */}
          {employees.length === 0 ? (
            <tr>
              <td colSpan="100%" className="text-center">
                Data Not Found
              </td>
            </tr>
          ) : (
            // Otherwise, render each employee as a row
            employees.map((emp) => <TableRow employee={emp} key={emp._id} />)
          )}
        </tbody>
      </table>

      {/* Pagination Controls */}
      <div className="d-flex justify-content-between align-items-center my-3">
        {/* Display current page info */}
        <span className="badge bg-primary">
          Page {currentPage} of {totalPages}
        </span>

        {/* Pagination Buttons */}
        <div>
          {/* Previous button */}
          <button
            className="btn btn-outline-primary me-2"
            onClick={handlePreviousPage}
            disabled={currentPage === 1} // Disable on first page
          >
            Previous
          </button>

          {/* Page number buttons */}
          {pageNumbers.map((page) => (
            <button
              key={page}
              className={`btn btn-outline-primary me-1 ${
                currentPage === page ? "active" : ""
              }`}
              onClick={() => handlePagination(page)}
            >
              {page}
            </button>
          ))}

          {/* Next button */}
          <button
            className="btn btn-outline-primary ms-2"
            onClick={handleNextPage}
            disabled={currentPage === totalPages} // Disable on last page
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default EmployeeTable;
