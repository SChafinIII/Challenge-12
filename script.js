// Import Libraries 
const mysql2 = require('mysql2');
const inquirer = require('inquirer');
const table = require('console.table');


require('dotenv').config()


// connection to sql
const connection = mysql2.createConnection({
  host: 'localhost',
  user: 'root',
  password: process.env.MYSQL_PASSWORD,
  database: 'employee_db'
});

// Throws error if connection fails. 

connection.connect(err => {
  if (err) {
    console.log(err); 
    throw err;
  }
  console.log('connected as id ' + connection.threadId);
});

const promptuser = () => {
  return inquirer.prompt([ 
    {
      type: 'list',
      name: 'choices',
      message: 'What would you like to do?',
      choices: ['View all Departments',
        'View all Roles',
        'View all Employees',
        'Add a new Department',
        'Add a new Role',
        'Add a new Employee',
        'Update Employee Role'
      ]
    }
  ])
}

promptuser().then((answers) => {
  switch (answers.choices) {
    case 'View all Departments':
      showDepartments();
      break;
    case 'View all Roles':
      showRoles();
      break;
    case 'View all Employees':
      showEmployees();
      break;
    case 'Add a new Department':
      addDepartment();
      break;
    case 'Add a new Role':
      addRole();
      break; 
    case 'Add new Employee':
      addEmployee();
      break; 
    case 'Update Employee Roles':
      updateRoles();
      break;
    default:
      console.log('NO RESPONSE SELECTED');
  }
}).catch(err => console.log(err));

//Show all Dept function
showDepartments = () => {
  console.log('Departements');
  const sql2 = `SELECT department.id AS id, department.name as department FROM department.`;


  connection.promise().query(sql2, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

//Show all Roles function
showRoles = () => {
  console.log('Roles');
  const sql2 = `SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id`

  connection.promise().query(sql2, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};

//Show all Employees function
showEmployees = () => {
  console.log('Employees');
  const sql2 = `SELECT employee.id, 
                employee.first_name, 
                employee.last_name, 
                role.title, 
                department.name AS department,
                role.salary, 
                CONCAT (manager.first_name, " ", manager.last_name) AS manager
                FROM employee
                LEFT JOIN role ON employee.role_id = role.id
                LEFT JOIN department ON role.department_id = department.id
                LEFT JOIN employee manager ON employee.manager_id = manager.id`;

  connection.promise().query(sql2, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptUser();
  });
};