// Importing React and useful hooks
import { useEffect, useState } from "react";

// Importing React Router hooks
// - useNavigate: to navigate programmatically
// - useParams: to extract route parameters (like employee id)
import { useNavigate, useParams } from "react-router-dom";

// Importing Bootstrap CSS for styling
import "bootstrap/dist/css/bootstrap.min.css";

// Importing API function that fetches employee details from the backend
import { GetEmployeeDetailsById } from "../api";

const EmployeeDetails = () => {
  // useNavigate helps us go back to another route programmatically (like "Back" button)
  const navigate = useNavigate();

  // useParams helps extract the "id" from the URL
  // Example: if URL = /employee/123 → id = 123
  const { id } = useParams();

  // State variable to store fetched employee data
  const [employee, setEmployee] = useState({});

  // Function to fetch employee details using the API
  const fetchEmployeeDetails = async () => {
    try {
      // Call backend API with the id from URL
      const data = await GetEmployeeDetailsById(id);

      // Update the employee state with the fetched data
      setEmployee(data);
    } catch (err) {
      // If something goes wrong, show an alert
      alert("Error fetching employee details", err);
    }
  };

  // useEffect runs after the component is mounted (first render)
  // and whenever 'id' changes
  useEffect(() => {
    fetchEmployeeDetails(); // Fetch employee details once component loads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]); // 'id' in dependency array ensures re-fetching if id changes

  // If no employee found or API returned nothing
  if (!employee) {
    return <div>Employee not found</div>;
  }

  // UI section - displays employee details
  return (
    <div className="container mt-5">
      <div
        className="card"
        style={{
          backgroundColor: "#113956ff",
          maxWidth: "600px",
          margin: "0 auto",
        }}
      >
        {/* Card header */}
        <div
          className="card-header"
          style={{ backgroundColor: "#2196F3", color: "white" }}
        >
          <h2 style={{ fontStyle: 'italic', fontWeight: 'bold' }}>Employee Details</h2>
        </div>

        <div className="card-body" style={{ backgroundColor: "#72a2cbff" }}>
          <div className="row mb-3">
            {/* Left column - Employee Profile Image */}
            <div className="col-md-3">
              <img
                src={employee.profileImage} // Employee image URL
                alt={employee.name} // Alt text for accessibility
                className="img-fluid rounded" // Bootstrap styling
              />
            </div>

            {/* Right column - Employee Information */}
            <div className="col-md-9">
              <h4>{employee.name}</h4>
              <p>
                <strong>Email:</strong> {employee.email}
              </p>
              <p>
                <strong>Phone:</strong> {employee.phone}
              </p>
              <p>
                <strong>Department:</strong> {employee.department}
              </p>
              <p>
                <strong>Salary:</strong> {employee.salary}
              </p>
            </div>
          </div>

          {/* Back button to navigate back to Employee list page */}
          <button
            className="btn btn-primary"
            onClick={() => navigate("/employee")} // Navigates to /employee route
          >
            Back
          </button>
        </div>
      </div>
    </div>
  );
};

// Exporting component so it can be used in other files
export default EmployeeDetails;
