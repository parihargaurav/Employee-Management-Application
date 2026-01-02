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

  // -------------------- INLINE STYLES --------------------
  const containerStyle = {
    marginTop: "3rem",
    padding: "2rem",
    background: "linear-gradient(135deg, #ffc0cb 0%, #ffb3d9 100%)",
    minHeight: "100vh",
  };

  const cardStyle = {
    backgroundColor: "#113956ff",
    maxWidth: "700px",
    margin: "0 auto",
    border: "3px solid #2196F3",
    borderRadius: "15px",
    boxShadow: "0 10px 30px rgba(33, 150, 243, 0.4)",
    overflow: "hidden",
  };

  const cardHeaderStyle = {
    background: "linear-gradient(135deg, #2196F3 0%, #1976D2 100%)",
    color: "white",
    padding: "1.5rem",
    borderBottom: "3px solid #1565C0",
  };

  const headerTitleStyle = {
    fontStyle: "italic",
    fontWeight: "bold",
    margin: 0,
    fontSize: "2rem",
    textShadow: "2px 2px 4px rgba(0, 0, 0, 0.2)",
  };

  const cardBodyStyle = {
    background: "linear-gradient(to bottom, #72a2cbff, #5a8db8)",
    padding: "2rem",
  };

  const imageStyle = {
    border: "4px solid #2196F3",
    borderRadius: "10px",
    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.2)",
    width: "100%",
  };

  const employeeNameStyle = {
    color: "#ffffff",
    fontWeight: "bold",
    fontSize: "1.8rem",
    marginBottom: "1rem",
    textShadow: "1px 1px 3px rgba(0, 0, 0, 0.3)",
  };

  const infoTextStyle = {
    color: "#ffffff",
    fontSize: "1.1rem",
    marginBottom: "0.8rem",
    lineHeight: "1.6",
  };

  const strongTextStyle = {
    color: "#e3f2fd",
    fontWeight: "600",
  };

  const backButtonStyle = {
    background: "linear-gradient(135deg, #ffc0cb 0%, #ff99b3 100%)",
    border: "none",
    padding: "0.7rem 2rem",
    fontWeight: "600",
    borderRadius: "8px",
    boxShadow: "0 4px 8px rgba(255, 192, 203, 0.4)",
    transition: "all 0.3s ease",
    color: "#2d6ba1",
    cursor: "pointer",
    fontSize: "1rem",
  };

  const notFoundStyle = {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    background: "linear-gradient(135deg, #ffc0cb 0%, #ffb3d9 100%)",
    fontSize: "2rem",
    color: "#2d6ba1",
    fontWeight: "bold",
  };

  // If no employee found or API returned nothing
  if (!employee || Object.keys(employee).length === 0) {
    return <div style={notFoundStyle}>Employee not found</div>;
  }

  // UI section - displays employee details
  return (
    <div className="container" style={containerStyle}>
      <div className="card" style={cardStyle}>
        {/* Card header */}
        <div className="card-header" style={cardHeaderStyle}>
          <h2 style={headerTitleStyle}>Employee Details</h2>
        </div>

        <div className="card-body" style={cardBodyStyle}>
          <div className="row mb-4">
            {/* Left column - Employee Profile Image */}
            <div className="col-md-4">
              <img
                src={employee.profileImage} // Employee image URL
                alt={employee.name} // Alt text for accessibility
                className="img-fluid rounded" // Bootstrap styling
                style={imageStyle}
              />
            </div>

            {/* Right column - Employee Information */}
            <div className="col-md-8">
              <h4 style={employeeNameStyle}>{employee.name}</h4>
              <p style={infoTextStyle}>
                <strong style={strongTextStyle}>Email:</strong> {employee.email}
              </p>
              <p style={infoTextStyle}>
                <strong style={strongTextStyle}>Phone:</strong> {employee.phone}
              </p>
              <p style={infoTextStyle}>
                <strong style={strongTextStyle}>Department:</strong>{" "}
                {employee.department}
              </p>
              <p style={infoTextStyle}>
                <strong style={strongTextStyle}>Salary:</strong> ₹
                {employee.salary}
              </p>
            </div>
          </div>

          {/* Back button to navigate back to Employee list page */}
          <button
            className="btn"
            style={backButtonStyle}
            onClick={() => navigate("/employee")} // Navigates to /employee route
            onMouseEnter={(e) => {
              e.target.style.transform = "translateY(-2px)";
              e.target.style.boxShadow =
                "0 6px 12px rgba(255, 192, 203, 0.5)";
            }}
            onMouseLeave={(e) => {
              e.target.style.transform = "translateY(0)";
              e.target.style.boxShadow = "0 4px 8px rgba(255, 192, 203, 0.4)";
            }}
          >
            ← Back to Employees
          </button>
        </div>
      </div>
    </div>
  );
};

// Exporting component so it can be used in other files
export default EmployeeDetails;