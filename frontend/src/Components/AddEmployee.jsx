// Import necessary dependencies
import { useEffect, useState } from "react";
import { notify } from "../utils"; // For showing toast notifications
import { CreateEmployee, UpdateEmployeeById } from "../api"; // API functions for CRUD operations

// AddEmployee Component
// Props:
// - showModal: boolean (whether to show modal or not)
// - setShowModal: function to toggle modal visibility
// - fetchEmployees: function to refresh employee list after add/update
// - employeeObj: object containing employee data (for editing)
function AddEmployee({ showModal, setShowModal, fetchEmployees, employeeObj }) {
  // Local state to hold employee form data
  const [employee, setEmployee] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    salary: "",
    profileImage: null,
  });

  // State to track if we are in update/edit mode
  const [updateMode, setUpdateMode] = useState(false);

  /* ---------------------- useEffect for Edit Mode ---------------------- */
  // Whenever `employeeObj` changes (when user clicks "edit" on a row),
  // we set form data to that employee’s info and enable update mode.
  useEffect(() => {
    if (employeeObj) {
      setEmployee(employeeObj);
      setUpdateMode(true);
    }
  }, [employeeObj]); // Runs when employeeObj prop changes

  /* ---------------------- Handle Input Changes ---------------------- */

  // For text inputs like name, email, phone, etc.
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Update the field that changed
    setEmployee({ ...employee, [name]: value });
  };

  // For file input (profile image)
  const handleFileChange = (e) => {
    // e.target.files[0] contains the uploaded file object
    setEmployee({ ...employee, profileImage: e.target.files[0] });
  };

  /* ---------------------- Reset Form State ---------------------- */
  const resetEmployeeStates = () => {
    setEmployee({
      name: "",
      email: "",
      phone: "",
      department: "",
      salary: "",
      profileImage: null,
    });
  };

  /* ---------------------- Handle Add or Update Employee ---------------------- */
  const handleAddEmployee = async (e) => {
    e.preventDefault(); // Prevent page reload on form submit
    try {
      // If updateMode is true -> call update API
      // else -> call create API
      const { success, message } = updateMode
        ? await UpdateEmployeeById(employee, employee._id)
        : await CreateEmployee(employee);

      // console.log("create OR update ", success, message);

      // Show notification based on success/failure
      if (success) {
        notify(message, "success");
      } else {
        notify(message, "error");
      }

      // Close modal after operation
      setShowModal(false);

      // Clear form
      resetEmployeeStates();

      // Refresh employee list in parent
      fetchEmployees();

      // Exit update mode
      setUpdateMode(false);
    } catch (err) {
      console.error(err);
      notify("Failed to create Employee", "error");
    }
  };

  /* ---------------------- Handle Modal Close ---------------------- */
  const handleModalClose = () => {
    // Close modal and reset everything
    setShowModal(false);
    setUpdateMode(false);
    resetEmployeeStates();
  };

const modalStyle = {
  display: showModal ? "block" : "none",
  backgroundColor: 'rgba(255, 192, 203, 0.5)'
};

const modalDialogStyle = {
  maxWidth: '600px',
  margin: '1.75rem auto'
};

const modalContentStyle = {
  background: 'linear-gradient(to bottom, #fff5f7, #ffffff)',
  border: '3px solid #ffc0cb',
  borderRadius: '15px',
  boxShadow: '0 10px 30px rgba(255, 192, 203, 0.4)'
};

const modalHeaderStyle = {
  background: 'linear-gradient(135deg, #ffc0cb 0%, #ff99b3 100%)',
  color: '#2d6ba1',
  borderBottom: '2px solid #ff99b3',
  borderRadius: '12px 12px 0 0',
  padding: '1.2rem 1.5rem'
};

const modalTitleStyle = {
  fontWeight: 'bold',
  fontSize: '1.5rem',
  margin: 0
};

const modalBodyStyle = {
  padding: '2rem 1.5rem'
};

const formLabelStyle = {
  color: '#2d6ba1',
  fontWeight: '600',
  marginBottom: '0.5rem'
};

const formControlStyle = {
  border: '2px solid #ffc0cb',
  borderRadius: '8px',
  transition: 'all 0.3s ease'
};

const submitButtonStyle = {
  background: 'linear-gradient(135deg, #2d6ba1 0%, #1e4d7b 100%)',
  border: 'none',
  padding: '0.7rem 2rem',
  fontWeight: '600',
  borderRadius: '8px',
  boxShadow: '0 4px 8px rgba(45, 107, 161, 0.3)',
  transition: 'all 0.3s ease',
  color: 'white',
  cursor: 'pointer'
};




  /* ---------------------- JSX Rendering (Modal + Form) ---------------------- */
  return (
  <div
    className={`modal ${showModal ? "d-block" : ""}`}
    tabIndex="-1"
    role="dialog"
    style={modalStyle}
  >
    <div className="modal-dialog" role="document" style={modalDialogStyle}>
      <div className="modal-content" style={modalContentStyle}>
        {/* Modal Header */}
        <div className="modal-header" style={modalHeaderStyle}>
          <h5 className="modal-title" style={modalTitleStyle}>
            {updateMode ? "Update Employee" : "Add Employee"}
          </h5>
          <button
            type="button"
            className="btn-close"
            onClick={handleModalClose}
            style={{ filter: 'invert(1)' }}
          ></button>
        </div>

        {/* Modal Body */}
        <div className="modal-body" style={modalBodyStyle}>
          <form onSubmit={handleAddEmployee}>
            {/* Name */}
            <div className="mb-3">
              <label className="form-label" style={formLabelStyle}>Name</label>
              <input
                type="text"
                className="form-control"
                style={formControlStyle}
                name="name"
                value={employee.name}
                onChange={handleChange}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ff99b3';
                  e.target.style.boxShadow = '0 0 0 0.2rem rgba(255, 192, 203, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ffc0cb';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Email */}
            <div className="mb-3">
              <label className="form-label" style={formLabelStyle}>Email</label>
              <input
                type="email"
                className="form-control"
                style={formControlStyle}
                name="email"
                value={employee.email}
                onChange={handleChange}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ff99b3';
                  e.target.style.boxShadow = '0 0 0 0.2rem rgba(255, 192, 203, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ffc0cb';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Phone */}
            <div className="mb-3">
              <label className="form-label" style={formLabelStyle}>Phone</label>
              <input
                type="text"
                className="form-control"
                style={formControlStyle}
                name="phone"
                value={employee.phone}
                onChange={handleChange}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ff99b3';
                  e.target.style.boxShadow = '0 0 0 0.2rem rgba(255, 192, 203, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ffc0cb';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Department */}
            <div className="mb-3">
              <label className="form-label" style={formLabelStyle}>Department</label>
              <input
                type="text"
                className="form-control"
                style={formControlStyle}
                name="department"
                value={employee.department}
                onChange={handleChange}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ff99b3';
                  e.target.style.boxShadow = '0 0 0 0.2rem rgba(255, 192, 203, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ffc0cb';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Salary */}
            <div className="mb-3">
              <label className="form-label" style={formLabelStyle}>Salary</label>
              <input
                type="text"
                className="form-control"
                style={formControlStyle}
                name="salary"
                value={employee.salary}
                onChange={handleChange}
                onFocus={(e) => {
                  e.target.style.borderColor = '#ff99b3';
                  e.target.style.boxShadow = '0 0 0 0.2rem rgba(255, 192, 203, 0.25)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#ffc0cb';
                  e.target.style.boxShadow = 'none';
                }}
                required
              />
            </div>

            {/* Profile Image Upload */}
            <div className="mb-3">
              <label className="form-label" style={formLabelStyle}>Profile Image</label>
              <input
                type="file"
                className="form-control"
                style={formControlStyle}
                name="profileImage"
                onChange={handleFileChange}
              />
            </div>

            {/* Submit Button */}
            <button 
              type="submit" 
              className="btn btn-primary"
              style={submitButtonStyle}
              onMouseEnter={(e) => {
                e.target.style.transform = 'translateY(-2px)';
                e.target.style.boxShadow = '0 6px 12px rgba(45, 107, 161, 0.4)';
              }}
              onMouseLeave={(e) => {
                e.target.style.transform = 'translateY(0)';
                e.target.style.boxShadow = '0 4px 8px rgba(45, 107, 161, 0.3)';
              }}
            >
              {updateMode ? "Update" : "Save"}
            </button>
          </form>
        </div>
      </div>
    </div>
  </div>
);
}

export default AddEmployee;
