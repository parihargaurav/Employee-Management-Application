// Import necessary dependencies
import  { useEffect, useState } from "react";
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

      console.log("create OR update ", success, message);

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

  /* ---------------------- JSX Rendering (Modal + Form) ---------------------- */
  return (
    // Bootstrap modal (conditionally displayed)
    <div
      className={`modal ${showModal ? "d-block" : ""}`}
      tabIndex="-1"
      role="dialog"
      style={{ display: showModal ? "block" : "none" }}
    >
      <div className="modal-dialog" role="document">
        <div className="modal-content">
          {/* Modal Header */}
          <div className="modal-header">
            <h5 className="modal-title">
              {updateMode ? "Update Employee" : "Add Employee"}
            </h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleModalClose}
            ></button>
          </div>

          {/* Modal Body - Contains Form */}
          <div className="modal-body">
            <form onSubmit={handleAddEmployee}>
              {/* Name */}
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  className="form-control"
                  name="name"
                  value={employee.name}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Email */}
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={employee.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Phone */}
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  className="form-control"
                  name="phone"
                  value={employee.phone}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Department */}
              <div className="mb-3">
                <label className="form-label">Department</label>
                <input
                  type="text"
                  className="form-control"
                  name="department"
                  value={employee.department}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Salary */}
              <div className="mb-3">
                <label className="form-label">Salary</label>
                <input
                  type="text"
                  className="form-control"
                  name="salary"
                  value={employee.salary}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* Profile Image Upload */}
              <div className="mb-3">
                <label className="form-label">Profile Image</label>
                <input
                  type="file"
                  className="form-control"
                  name="profileImage"
                  onChange={handleFileChange}
                />
              </div>

              {/* Submit Button */}
              <button type="submit" className="btn btn-primary">
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
