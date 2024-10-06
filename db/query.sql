import inquirer from 'inquirer';
import { fetchEmployees, fetchRoles, fetchDepartments } from './dbService'; // Assuming this is your service

// Function to display employees in table format
async function viewEmployees() {
  const employees = await fetchEmployees(); // Fetch employees from the database
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
  console.log("-".repeat(110));  // Separator line

  employees.forEach((employee) => {
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

// Function to display roles
async function viewRoles() {
  const roles = await fetchRoles(); // Fetch roles from the database
  console.log("\nList of Roles:");
  roles.forEach((role, index) => {
    console.log(`${index + 1}. ${role.title} (${role.department}) - $${role.salary}`);
  });
  startCli(); // Go back to CLI options
}

// Function to display departments
async function viewDepartments() {
  const departments = await fetchDepartments(); // Fetch departments from the database
  console.log("\nList of Departments:");
  departments.forEach((department, index) => {
    console.log(`${index + 1}. ${department.name}`);
  });
  startCli(); // Go back to CLI options
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
        'View All Roles',
        'View All Departments',
        'Quit'
      ]
    }
  ]);

  switch (action) {
    case 'View Employees':
      viewEmployees();
      break;
    case 'View All Roles':
      viewRoles();
      break;
    case 'View All Departments':
      viewDepartments();
      break;
    case 'Quit':
      console.log('Exiting Employee Tracker CLI');
      process.exit();
  }
}

// Start the CLI
console.log("Welcome to the Employee Tracker CLI");
startCli();
