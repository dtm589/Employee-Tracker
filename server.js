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
        let deptName = res.deptName;
        db.query(query, { name: res.deptName }, (err, res) => {
            if (err) {
                console.log(err);
            }
            console.log(`${deptName} has been added to the database.`);
            promptUser();
        })
    })
};

function addRole() {
    let query = `SELECT department.id, department.name FROM department`;
    db.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
        let departments = res.map(({ id, name }) => ({
            value: id,
            name: name
        }));
        addToRole(departments);
    })
};

function addToRole(departments) {
    inquirer.prompt([
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
            message: 'Which department does the role belong to? ',
            choices: departments
        }
    ]).then((res) => {
        let query = 'INSERT INTO role SET ?';
        let name = res.name;
        db.query(query, { title: res.name, salary: res.salary, department_id: res.department }, (err, res) => {
            if (err) {
                console.log(err);
            }
            console.log(`${name} has been added to the database.`);
            promptUser();
        })
    })
};

function addEmpl() {
    let query = `SELECT role.id, role.title FROM role`;
    let query2 = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;
    db.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
        let roles = res.map(({ id, title }) => ({
            value: id,
            name: title
        }));
        db.query(query2, (err, res) => {
            if (err) {
                console.log(err);
            }
            let employees = res.map(({ id, first_name, last_name }) => ({
                value: id,
                name: first_name + ' ' + last_name
            }));
            employees.push({ value: null, name: 'None' });
            addToEmpl(roles, employees);
        })
    })
};

function addToEmpl(roles, employees) {
    inquirer.prompt([
        {
            type: 'input',
            message: 'What is the first name of the employee?',
            name: 'firstName'
        },
        {
            tpye: 'input',
            message: 'What is the last name of the employee?',
            name: 'lastName'
        },
        {
            type: 'list',
            message: 'What is the role of the employee?',
            name: 'role',
            choices: roles
        },
        {
            type: 'list',
            message: 'Who is their manager?',
            name: 'manager',
            choices: employees
        }
    ]).then((res) => {
        let query = 'INSERT INTO employee SET ?';
        let fullName = res.firstName + '' + res.lastName;
        db.query(query, { first_name: res.firstName, last_name: res.lastName, role_id: res.role, manager_id: res.manager }, (err, res) => {
            if (err) {
                console.log(err);
            }
            console.log(`${fullName} has been added to the database.`);
            promptUser();
        })
    })
};

function updateEmplRole() {
    let query = `SELECT role.id, role.title FROM role`;
    let query2 = `SELECT employee.id, employee.first_name, employee.last_name FROM employee`;
    db.query(query, (err, res) => {
        if (err) {
            console.log(err);
        }
        let roles = res.map(({ id, title }) => ({
            value: id,
            name: title
        }));
        db.query(query2, (err, res) => {
            if (err) {
                console.log(err);
            }
            let employees = res.map(({ id, first_name, last_name }) => ({
                value: id,
                name: first_name + ' ' + last_name
            }));
            ToupdateEmplRole(employees, roles);
        })
    })
};

function ToupdateEmplRole(employees, roles) {
    inquirer.prompt([
        {
            type: 'list',
            message: "Which employee's role do you want to update?",
            name: 'employee',
            choices: employees
        },
        {
            type: 'list',
            message: 'Which role do you want to assign the selected employee?',
            name: 'role',
            choices: roles
        }
    ]).then((res) => {
        let query = 'UPDATE employee SET role_id = ? WHERE id = ?';
        db.query(query, [res.role, res.employee], (err, res) => {
            if (err) {
                console.log(err);
            }
            console.log(`Employee has been updated.`);
            promptUser();
        })
    })
};

// Default response for any other request (Not Found)
app.use((req, res) => {
    res.status(404).end();
});

app.listen(PORT, () => {
});

//Call to function to start the app
promptUser();