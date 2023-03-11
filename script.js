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
  promptuser();
});

const promptuser = () => {
  inquirer.prompt([
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
        'Update Employee Roles'
      ]
    }
  ])
    .then((answers) => {
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
        case 'Add a new Employee':
          addEmployee();
          break;
        case 'Update Employee Roles':
          updateRoles();
          break;
        default:
          console.log('NO RESPONSE SELECTED');
      }
    }).catch(err => console.log(err));
}

//Show all Dept function
const showDepartments = () => {
  console.log('Departements');
  const sql2 = `SELECT department.id AS id, department.name as department FROM department`;


  connection.query(sql2, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptuser();
  });
};

//Show all Roles function
const showRoles = () => {
  console.log('Roles');
  const sql2 = `SELECT role.id, role.title, department.name AS department FROM role INNER JOIN department ON role.department_id = department.id`;

  connection.query(sql2, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptuser();
  });
};

//Show all Employees function
const showEmployees = () => {
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

  connection.query(sql2, (err, rows) => {
    if (err) throw err;
    console.table(rows);
    promptuser();
  });
};

// add a Department 
const addDepartment = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'addDepartment',
      message: "What is the name of the Department you would like to add?"
    }
  ]).then(answer => {
    const sql2 = 'INSERT INTO department (name) VALUES (?)';
    connection.query(sql2, answer.addDepartment,
      (err, rows) => {

        console.table(rows);
        showDepartments();
      }
    )
  }
  )
}

// add a Role 
const addRole = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'title',
      message: "What is the title of the role you want to add?",
      validate: input => {
        if (input) {
          return true;
        } else {
          console.log('Please enter a role.');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'salary',
      message: "What is this roles salary?",
      validate: input => {
        if (input) {
          return true;
        } else {
          console.log('Please enter a salary.');
          return false;
        }
      }
    },
    {
      type: 'input',
      name: 'department',
      message: "What Department is this Role?",
      validate: input => {
        if (input) {
          return true;
        } else {
          console.log('Please enter a Department.');
          return false;
        }
      }
    }
  ]).then(answer => {
    const sql2 = 'INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)';
    connection.query(sql2, [answer.title, answer.salary, answer.department],
      (err, rows) => {

        console.table(rows);
        showRoles();
      }
    )
  }
  )
}



// add an Employee

const addEmployee = () => {
  const rolesql = 'SELECT role.id AS value, role.title AS name FROM role';
  connection.query(rolesql, (err, rows) => {
    if (err) throw err;
    const managesql = 'SELECT id AS value, CONCAT(first_name, " ", last_name) AS name FROM employee';
    connection.query(managesql, (err, employeerows) => { 
      if (err) throw err;

      inquirer.prompt([
        {
          type: 'input',
          name: 'first_name',
          message: "What is the employee's first name?",
          validate: input => {
            if (input) {
              return true;
            } else {
              console.log('Please enter a first name.');
              return false;
            }
          }
        },
        {
          type: 'input',
          name: 'last_name',
          message: "What is the employee's last name?",
          validate: input => {
            if (input) {
              return true;
            } else {
              console.log('Please enter a last name.');
              return false;
            }
          }
        },
        {
          type: 'list',
          name: 'role',
          message: "What is the Employee's role?",
          choices: rows
        },
        {
          type: 'list',
          name: 'manager',
          message: "Who is the Employee's manager?",
          choices: employeerows
        }
      ])
        .then(answer => {
          const sql2 = 'INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES(?, ?, ?, ?)';
          connection.query(sql2, [answer.first_name, answer.last_name, answer.role, answer.manager],
            (err, rows) => {

              console.table(rows);
              showEmployees();
            })
        });
    }
    )
  }
  )
}

// update an Employee
const updateRoles = () => {
  inquirer.prompt([
    {
      type: 'input',
      name: 'first_name',
      message: 'What is the name of the employee?',
      validate: input => {
        if (input) {
          return true;
        } else {
          console.log('Please enter a name.');
          return false;
        }
      }
    },
    {
      type: 'number',
      name: 'role',
      message: "What is new role ID of the employee?",
      validate: input => {
        if (input) {
          return true;
        } else {
          console.log('Please enter a role ID.');
          return false;
        }
      }
    }
  ]).then(answer => {
    const update = 'UPDATE employee set role_id = ? WHERE first_name = ?'
    connection.query(update, [answer.role, answer.first_name],
      (err, rows) => {

    console.table(rows);
    showEmployees();
  })
});
}