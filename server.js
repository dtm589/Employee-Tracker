//Import and require express
const express = require('express');

// Import and require mysql2
const mysql = require('mysql2');

//Import and require inquirer
const inquirer = require('inquirer');

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
    {
        host: 'localhost',
        // MySQL username,
        user: 'root',
        // MySQL password
        password: 'Uncharted1',
        database: 'employee_tracker'
    },
    console.log(`Connected to the employee_tracker database.`)
);








// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:3001`);
});