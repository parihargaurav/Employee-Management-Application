// Base URL for your backend API (make sure your server runs on this port)
const BASE_URL = 'http://localhost:4444';

/* -------------------- 1. Get All Employees -------------------- */
export const GetAllEmployees = async (search = '', page = 1, limit = 5) => {
    // Construct the full API URL with query parameters for search, pagination, and limit
    const url = `${BASE_URL}/api/employees?search=${search}&page=${page}&limit=${limit}`;

    // Set up the HTTP GET request options
    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        // Send the request and wait for the response
        const result = await fetch(url, options);

        // Parse the JSON response and extract the `data` object
        const { data } = await result.json();

        // Return the list of employees
        return data;
    } catch (err) {
        // If something goes wrong, return the error
        return err;
    }
};


/* -------------------- 2. Get Employee Details by ID -------------------- */
export const GetEmployeeDetailsById = async (id) => {
    // Construct the URL using the employee ID
    const url = `${BASE_URL}/api/employees/${id}`;

    const options = {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        // Send the request
        const result = await fetch(url, options);

        // Extract the `data` field from the JSON response
        const { data } = await result.json();

        // Log data for debugging
        console.log(data);

        // Return the employee details
        return data;
    } catch (err) {
        return err;
    }
};


/* -------------------- 3. Delete Employee by ID -------------------- */
export const DeleteEmployeeById = async (id) => {
    // Construct the URL using the employee ID
    const url = `${BASE_URL}/api/employees/${id}`;

    const options = {
        method: 'DELETE', // DELETE request
        headers: {
            'Content-Type': 'application/json'
        }
    };

    try {
        // Send the delete request
        const result = await fetch(url, options);

        // Parse the response JSON
        const data = await result.json();

        // Log for debugging
        console.log(data);

        // Return the result (usually a success message)
        return data;
    } catch (err) {
        return err;
    }
};


/* -------------------- 4. Create a New Employee -------------------- */
export const CreateEmployee = async (empObj) => {
    const url = `${BASE_URL}/api/employees`;
    console.log('url ', url);

    // Create a FormData object to handle both text and file uploads (e.g. profile photo)
    const formData = new FormData();

    // Loop through each key in the employee object and append it to FormData
    for (const key in empObj) {
        formData.append(key, empObj[key]);
    }

    // POST request — FormData automatically sets headers
    const options = {
        method: 'POST',
        body: formData
    };

    try {
        // Send the POST request
        const result = await fetch(url, options);

        // Parse JSON response
        const data = await result.json();

        // Return created employee data or success message
        return data;
    } catch (err) {
        return err;
    }
};


/* -------------------- 5. Update Employee by ID -------------------- */
export const UpdateEmployeeById = async (empObj, id) => {
    const url = `${BASE_URL}/api/employees/${id}`;
    console.log('url ', url);

    // Create a FormData object for sending both text and file data
    const formData = new FormData();

    // Add all key-value pairs from empObj to FormData
    for (const key in empObj) {
        formData.append(key, empObj[key]);
    }

    // PUT request to update the employee record
    const options = {
        method: 'PUT',
        body: formData
    };

    try {
        // Send the PUT request
        const result = await fetch(url, options);

        // Parse the JSON response
        const data = await result.json();

        // Log for debugging
        console.log('<---update--> ', data);

        // Return the updated employee data
        return data;
    } catch (err) {
        return err;
    }
};
