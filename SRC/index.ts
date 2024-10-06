import inquirer from 'inquirer';
import { 
  fetchEmployees, 
  fetchRoles, 
  fetchDepartments, 
  addEmployeeToDb, 
  updateEmployeeRoleInDb, 
  addRoleToDb, 
  addDepartmentToDb, 
  deleteEmployeeFromDb, // Include deleteEmployee function
  deleteRoleFromDb // Include deleteRole function
} from './dbService.js'; // Adjust this if you use CommonJS modules

// Define types for Employee, Role, and Department
type Employee = {
  id: number;
  first_name: string;
  last_name: string;
  title: string;
  salary: number;
  department: string;
  manager_first_name: string | null;
  manager_last_name: string | null;
};

// Function to display employees in table format
async function viewEmployees() {
  const employees: Employee[] = await fetchEmployees();
  console.log("\nList of Employees:");
  console.log(
    "ID".padEnd(5) +
    "First Name".padEnd(15) +
    "Last Name".padEnd(15) +
    "Title".padEnd(25) +
    "Department".padEnd(20) +
    "Salary".padEnd(10) +
    "Manager".padEnd(20)
  );
  console.log("-".repeat(110));

  employees.forEach((employee: Employee) => {
    const managerName = employee.manager_first_name && employee.manager_last_name
      ? `${employee.manager_first_name} ${employee.manager_last_name}`
      : "No Manager";

    console.log(
      `${employee.id.toString().padEnd(5)}` +
      `${employee.first_name.padEnd(15)}` +
      `${employee.last_name.padEnd(15)}` +
      `${employee.title.padEnd(25)}` +
      `${employee.department.padEnd(20)}` +
      `$${employee.salary.toString().padEnd(10)}` +
      `${managerName.padEnd(20)}`
    );
  });
  startCli(); // Go back to CLI options
}

// Function to add an employee
async function addEmployee() {
  const roles = await fetchRoles();
  const { firstName, lastName, roleIndex, managerName } = await inquirer.prompt([
    { type: 'input', name: 'firstName', message: 'Enter first name:' },
    { type: 'input', name: 'lastName', message: 'Enter last name:' },
    {
      type: 'list',
      name: 'roleIndex',
      message: 'Select a Role:',
      choices: roles.map((role, index) => ({ name: `${role.title} (${role.department})`, value: index }))
    },
    { type: 'input', name: 'managerName', message: 'Enter manager (leave blank for none):' }
  ]);

  const selectedRole = roles[roleIndex];
  await addEmployeeToDb(firstName, lastName, selectedRole.id, managerName);
  console.log(`Employee ${firstName} ${lastName} added successfully!`);
  viewEmployees();
}

// Function to update employee role
async function updateEmployeeRole() {
  const employees = await fetchEmployees();
  const roles = await fetchRoles();
  const { employeeIndex, roleIndex } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeIndex',
      message: 'Select an employee to update their role:',
      choices: employees.map((employee, index) => ({ name: `${employee.first_name} ${employee.last_name}`, value: index }))
    },
    {
      type: 'list',
      name: 'roleIndex',
      message: 'Select a new role for the employee:',
      choices: roles.map((role, index) => ({ name: `${role.title} (${role.department})`, value: index }))
    }
  ]);

  const selectedEmployee = employees[employeeIndex];
  const selectedRole = roles[roleIndex];
  await updateEmployeeRoleInDb(selectedEmployee.id, selectedRole.id);
  console.log(`${selectedEmployee.first_name} ${selectedEmployee.last_name}'s role has been updated to ${selectedRole.title}.`);
  startCli();
}

// Function to delete an employee
async function deleteEmployee() {
  const employees = await fetchEmployees();
  const { employeeIndex } = await inquirer.prompt([
    {
      type: 'list',
      name: 'employeeIndex',
      message: 'Select an employee to delete:',
      choices: employees.map((employee, index) => ({ name: `${employee.first_name} ${employee.last_name}`, value: index }))
    }
  ]);

  const selectedEmployee = employees[employeeIndex];
  await deleteEmployeeFromDb(selectedEmployee.id);
  console.log(`${selectedEmployee.first_name} ${selectedEmployee.last_name} has been deleted.`);
  viewEmployees();
}

// Function to view roles in table format
async function viewRoles() {
  const roles = await fetchRoles();
  console.log("\nList of Roles:");
  console.log(
    "ID".padEnd(5) +
    "Title".padEnd(25) +
    "Department".padEnd(20) +
    "Salary".padEnd(10)
  );
  console.log("-".repeat(60));

  roles.forEach((role) => {
    console.log(
      `${role.id.toString().padEnd(5)}` +
      `${role.title.padEnd(25)}` +
      `${role.department.padEnd(20)}` +
      `$${role.salary.toString().padEnd(10)}`
    );
  });
  startCli();
}

// Function to add a role
async function addRole() {
  const departments = await fetchDepartments();
  const { title, salary, departmentIndex } = await inquirer.prompt([
    { type: 'input', name: 'title', message: 'Enter role title:' },
    { type: 'input', name: 'salary', message: 'Enter role salary:' },
    {
      type: 'list',
      name: 'departmentIndex',
      message: 'Select a department for the role:',
      choices: departments.map((department, index) => ({ name: department.name, value: index }))
    }
  ]);

  const selectedDepartment = departments[departmentIndex];
  await addRoleToDb(title, salary, selectedDepartment.id);
  console.log(`Role ${title} added successfully to ${selectedDepartment.name} department.`);
  viewRoles();
}

// Function to delete a role
async function deleteRole() {
  const roles = await fetchRoles();
  const { roleIndex } = await inquirer.prompt([
    {
      type: 'list',
      name: 'roleIndex',
      message: 'Select a role to delete:',
      choices: roles.map((role, index) => ({ name: role.title, value: index }))
    }
  ]);

  const selectedRole = roles[roleIndex];
  await deleteRoleFromDb(selectedRole.id);
  console.log(`Role ${selectedRole.title} has been deleted.`);
  viewRoles();
}

// Function to view departments in table format
async function viewDepartments() {
  const departments = await fetchDepartments();
  console.log("\nList of Departments:");
  console.log(
    "ID".padEnd(5) +
    "Department Name".padEnd(25)
  );
  console.log("-".repeat(30));

  departments.forEach((department) => {
    console.log(
      `${department.id.toString().padEnd(5)}` +
      `${department.name.padEnd(25)}`
    );
  });
  startCli();
}

// Function to add a department
async function addDepartment() {
  const { name } = await inquirer.prompt([
    { type: 'input', name: 'name', message: 'Enter department name:' }
  ]);

  await addDepartmentToDb(name);
  console.log(`Department ${name} added successfully.`);
  viewDepartments();
}

// CLI Menu
async function startCli() {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: 'What would you like to do?',
      choices: [
        'View Employees',
        'Add Employee',
        'Update Employee Role',
        'Delete Employee', // New option to delete employee
        'View All Roles',
        'Add Role',
        'Delete Role', // New option to delete role
        'View All Departments',
        'Add Department',
        'Quit'
      ]
    }
  ]);

  switch (action) {
    case 'View Employees':
      viewEmployees();
      break;
    case 'Add Employee':
      addEmployee();
      break;
    case 'Update Employee Role':
      updateEmployeeRole();
      break;
    case 'Delete Employee':
      deleteEmployee();
      break;
    case 'View All Roles':
      viewRoles();
      break;
    case 'Add Role':
      addRole();
      break;
    case 'Delete Role':
      deleteRole();
      break;
    case 'View All Departments':
      viewDepartments();
      break;
    case 'Add Department':
      addDepartment();
      break;
    case 'Quit':
      console.log('Exiting Employee Tracker CLI');
      process.exit();
  }
}

// Start the CLI
console.log("Welcome to the Employee Tracker CLI");
startCli();
