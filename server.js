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

function promptUser() {
    inquirer.prompt([
        {
            type: 'list',
            name: 'userSelect',
            message: 'What would you like to do?',
            choices: [
                'View all departments',
                'View all roles',
                'View all employees',
                'Add a department',
                'Add a role',
                'Add an employee',
                'Update an employee role'
            ]
        }
    ]).then((res) => {
        console.log(`You have chosen ${res.userSelect}.`)
        switch(res.userSelect){
            case 'View all departments':
                viewAllDept();
                break;
            case 'View all roles':
                viewAllRoles();
                break;
            case 'View all employees':
                viewAllEmpl();
                break;
            case 'Add a department':
                addDept();
                break;
            case 'Add a role':
                addRole();
                break;
            case 'Add an employee':
                addEmpl();
                break;
            case 'Update an employee role':
                updateEmplRole();
                break;
        }
    })
};

function viewAllDept() {
    let query = 'SELECT * FROM department';
    db.query(query, (err, result) => {
        if (err) {
          console.log(err);
        }
        console.log(result);
      })
};




// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:3001`);
});

//Call to function to start the app
promptUser();