const EmployeeModel = require("../Models/EmployeeModel");

// Controller function to get all employees with pagination and optional search
const getAllEmployees = async (req, res) => {
    try {
        // Extract query parameters: page number, page size (limit), and search text
        let { page, limit, search } = req.query;

        // Convert query params from string → number (default to page=1, limit=10 if not provided)
        page = parseInt(page) || 1;
        limit = parseInt(limit) || 10;

        // Calculate how many documents to skip (for pagination)
        // Example: if page=2, limit=10 → skip (2-1)*10 = 10 documents
        const skip = (page - 1) * limit;

        // Initialize search criteria (empty by default)
        let searchCriteria = {};

        // If a search term is provided, filter employees by name
        // Using regex to perform partial and case-insensitive match
        if (search) {
            searchCriteria = {
                name: {
                    $regex: search,   // pattern matching on name
                    $options: 'i'     // 'i' means case-insensitive search
                }
            };
        }

        // Count total number of matching employees (for pagination info)
        const totalEmployees = await EmployeeModel.countDocuments(searchCriteria);

        // Fetch employees from database:
        // - apply search criteria
        // - skip documents for pagination
        // - limit results per page
        // - sort by 'updatedAt' in descending order (latest first)
        const emps = await EmployeeModel.find(searchCriteria)
            .skip(skip)
            .limit(limit)
            .sort({ updatedAt: -1 });

        // Calculate total number of pages
        const totalPages = Math.ceil(totalEmployees / limit);

        // Send successful response with employee data + pagination details
        res.status(200).json({
            message: 'All Employees',
            success: true,
            data: {
                employees: emps,
                pagination: {
                    totalEmployees,  // total matching records
                    currentPage: page,  // current page number
                    totalPages,         // total available pages
                    pageSize: limit     // number of employees per page
                }
            }
        });

    } catch (err) {
        // Log and handle any errors that occur during execution
        console.log(err);
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err
        });
    }
};

// Controller: createEmployee
// Purpose: Handles POST request to create a new employee record

const createEmployee = async (req, res) => {
  try {
    // Extract the body data (name, email, etc.) from the incoming request
    // This data typically comes from the frontend form (JSON or multipart/form-data)
    const body = req.body;

    // If an image file is uploaded (via Multer middleware), extract its Cloudinary URL/path
    // 'req.file' will exist only if an image was uploaded
    const profileImage = req?.file ? req?.file?.path : null;

    // Add the uploaded image URL/path to the 'body' data before saving to the database
    body.profileImage = profileImage;

    // Create a new instance of the Employee model using the request data
    // This will map fields from 'body' to your MongoDB schema (e.g., name, email, etc.)
    const emp = new EmployeeModel(body);

    // Save the new employee document into MongoDB
    // This triggers Mongoose validation (required fields, data types, etc.)
    await emp.save();

    // If saving is successful, send a success response with status 201 (Created)
    res.status(201).json({
      message: "Employee Created",
      success: true,
    });
  } catch (err) {
    // If any error occurs (validation, DB issue, etc.), log it to console for debugging
    console.log("Error ", err);

    // Send an error response with 500 (Internal Server Error)
    res.status(500).json({
      message: "Internal Server Error",
      success: false,
      error: err, // You can remove this in production for cleaner responses
    });
  }
};

// Controller function to get a single employee by ID
const getEmployeeById = async (req, res) => {
  try {
    // Extract 'id' parameter from the URL (e.g., /employees/:id)
    const id = req.params.id;

    // Use Mongoose to find one employee whose _id matches the provided id
    // 'await' ensures we wait for the database operation to complete
    const emp = await EmployeeModel.findOne({ _id: id });

    // If employee found successfully, send a 200 OK response with the data
    res.status(200).json({
      message: "Employee Details", // success message
      success: true, // indicate operation success
      data: emp, // send employee data to client
    });
  } catch (err) {
    // If any error occurs (invalid ID, DB error, etc.), log it
    console.log(err);

    // Send a 500 Internal Server Error response with error details
    res.status(500).json({
      message: "Internal Server Error", // error message
      success: false, // indicate failure
      error: err, // include actual error (optional)
    });
  }
};

// Controller function to update an employee by their ID
const updateEmployeeById = async (req, res) => {
    try {
        // Extracting 'id' from route parameters (/employee/:id)
        const { id } = req.params;

        // Extracting specific fields from the request body
        const { name, email, phone, department, salary } = req.body;

        // Creating an object with fields that can be updated
        // Also adding 'updatedAt' to track when the record was last modified
        let updateData = {
            name,
            email,
            phone,
            department,
            salary,
            updatedAt: new Date() // current timestamp
        };

        // Logging the file info (if any) uploaded via Multer middleware
        console.log('<-- update ---> ', req.file);

        // If a new profile image is uploaded, update the profileImage field
        if (req.file) {
            updateData.profileImage = req.file.path; // Cloudinary URL from multer-storage-cloudinary
        }

        // Find the employee by ID and update with new data
        // { new: true } ensures it returns the updated document instead of the old one
        const updatedEmployee = await EmployeeModel.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        );

        // If no employee found with the given ID, return 404 error
        if (!updatedEmployee) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        // If successful, send back the updated employee data with a success message
        res.status(200).json({
            message: 'Employee Updated Successfully',
            success: true,
            data: updatedEmployee
        });

    } catch (error) {
        // Catch any unexpected errors and send a 500 Internal Server Error response
        res.status(500).json({ message: error.message });
    }
};

// Controller function to delete an employee by their ID
const deleteEmployeeById = async (req, res) => {
    try {
        // Extract the 'id' from the route parameters (/employee/:id)
        const id = req.params.id;

        // Delete the employee document from MongoDB where _id matches the given id
        await EmployeeModel.deleteOne({ _id: id });

        // If deletion is successful, send a success response
        res.status(200).json({
            message: 'Employee Deleted Successfully',
            success: true
        });

    } catch (err) {
        // Log the error to the console for debugging
        console.log(err);

        // Send an error response if something goes wrong (e.g., invalid ID or DB issue)
        res.status(500).json({
            message: 'Internal Server Error',
            success: false,
            error: err
        });
    }
};



module.exports = {
  getAllEmployees,
  createEmployee,
  getEmployeeById,
  updateEmployeeById,
  deleteEmployeeById,
};
