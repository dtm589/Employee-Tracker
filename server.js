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
        switch (res.userSelect) {
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
        promptUser();
    })
};

function viewAllRoles() {
    let query = 'SELECT * FROM role';
    db.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log(res);
        promptUser();
    })
};

function viewAllEmpl() {
    let query = `SELECT 
    employee.id, 
    employee.first_name, 
    employee.last_name, 
    role.title, 
    department.name AS department, 
    role.salary, 
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
    ON employee.role_id = role.id
    LEFT JOIN department
    ON department.id = role.department_id
    LEFT JOIN employee manager
    ON manager.id = employee.manager_id`;
    db.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
        console.log(res);
        promptUser();
    })
};

function addDept() {
    inquirer.prompt([
        {
            type: 'input',
            name: 'deptName',
            message: 'New Department Name: '
        }
    ]).then((res) => {
        let query = 'INSERT INTO department SET ?';
        db.query(query, { name: res.deptName }, (err, res) => {
            if (err) {
                console.log(err);
            }
            console.log(`${res.deptName} has been added to the database.`);  //NEED TO FIX THIS
            promptUser();
        })
    })
};

function addRole() {
    inquirer.prompt ([
        {
            type: 'inpt',
            name: 'name',
            message: 'What is the name of the role? '
        },
        {
            tpye: 'input',
            name: 'salary',
            message: 'What is the salary of the role? '
        },
        {
            type: 'list',
            name: 'department',
            message: 'Which department does the role belong to? '
        }
    ])
}


// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:3001`);
});

//Call to function to start the app
promptUser();