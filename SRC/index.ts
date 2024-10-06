import readline from 'readline';

// Define types for Department, Role, and Employee
type Department = {
  name: string;
};

type Role = {
  title: string;
  salary: number;
  department: Department;
};

type Employee = {
  firstName: string;
  lastName: string;
  role: Role;
  manager: Employee | null;
};

// Employees, Roles, and Departments arrays
const departments: Department[] = [];
const roles: Role[] = [];
const employees: Employee[] = [];

// Create department instances
const engineering: Department = { name: "Engineering" };
const hr: Department = { name: "Human Resources" };
const sales: Department = { name: "Sales" };

// Add departments to array
departments.push(engineering);
departments.push(hr);
departments.push(sales);

// Create role instances
const softwareEngineer: Role = { title: "Software Engineer", salary: 80000, department: engineering };
const hrManager: Role = { title: "HR Manager", salary: 90000, department: hr };
const salesRep: Role = { title: "Sales Representative", salary: 50000, department: sales };

// Add roles to array
roles.push(softwareEngineer);
roles.push(hrManager);
roles.push(salesRep);

// Create employee instances
const employee1: Employee = { firstName: "Alice", lastName: "Johnson", role: softwareEngineer, manager: null };
const employee2: Employee = { firstName: "Bob", lastName: "Smith", role: hrManager, manager: null };
const employee3: Employee = { firstName: "Charlie", lastName: "Brown", role: salesRep, manager: null };

// Set managers (Bob is the manager of Alice)
employee1.manager = employee2;

// Add employees to array
employees.push(employee1);
employees.push(employee2);
employees.push(employee3);

// CLI Logic
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to display employees
function viewEmployees() {
  console.log("\nList of Employees:");
  employees.forEach((employee, index) => {
    const managerName = employee.manager ? `${employee.manager.firstName} ${employee.manager.lastName}` : "No Manager";
    console.log(
      `${index + 1}. ${employee.firstName} ${employee.lastName} - ${employee.role.title}, ${employee.role.department.name} (Manager: ${managerName})`
    );
  });
  startCli();
}

// Function to add a new employee
function addEmployee() {
  rl.question("Enter first name: ", (firstName) => {
    rl.question("Enter last name: ", (lastName) => {
      console.log("\nSelect a Role:");
      roles.forEach((role, index) => {
        console.log(`${index + 1}. ${role.title} (${role.department.name})`);
      });
      rl.question("Select a role number: ", (roleIndex) => {
        const selectedRole = roles[parseInt(roleIndex) - 1];
        rl.question("Enter manager (leave blank for none): ", (managerName) => {
          const manager = employees.find(emp => `${emp.firstName} ${emp.lastName}` === managerName) || null;
          const newEmployee: Employee = { firstName, lastName, role: selectedRole, manager };
          employees.push(newEmployee);
          console.log(`Employee ${firstName} ${lastName} added successfully!`);
          viewEmployees();
        });
      });
    });
  });
}

// CLI Menu
function startCli() {
  console.log("\nEmployee Tracker Menu:");
  console.log("1. View Employees");
  console.log("2. Add Employee");
  console.log("3. Exit");
  rl.question("\nSelect an option: ", (option) => {
    switch (option) {
      case "1":
        viewEmployees();
        break;
      case "2":
        addEmployee();
        break;
      case "3":
        rl.close();
        console.log("Exiting Employee Tracker CLI");
        break;
      default:
        console.log("Invalid option, please try again.");
        startCli();
        break;
    }
  });
}

// Start the CLI
console.log("Welcome to the Employee Tracker CLI");
startCli();
