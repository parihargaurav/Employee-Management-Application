const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");
require("dotenv").config();
const EmployeeRouter = require("./Routes/EmployeeRoutes");

const PORT = process.env.PORT;

require("./Models/db");
app.use(cors());
app.use(bodyParser.json()); 

app.get("/", (req, res) => {
    res.send("Hello World!");
});

// middleware
app.use('/api/employees', EmployeeRouter);



 // callback function       
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
