# Employee Manager CLI

## Description

The **Employee Manager CLI** is a command-line interface application that helps manage a company's departments, roles, and employees. It allows users to interact with the employee database by viewing, adding, updating, and deleting employees, roles, and departments. The application is built using **Node.js**, **TypeScript**, and **PostgreSQL**.

Upon startup, the application displays an ASCII art banner of "Employee Manager" before prompting the user with a menu to choose from various options.

## Features

- **View Employees**: Display all employees in a table format with their ID, first name, last name, role, salary, department, and manager.
- **Add Employee**: Add a new employee by specifying the employee's first and last name, selecting a role, and optionally assigning a manager.
- **Update Employee Role**: Update the role of an existing employee by selecting a new role for them.
- **Delete Employee**: Delete an employee from the database.
- **View Roles**: Display all roles in a table format with their title, salary, and department.
- **Add Role**: Add a new role by specifying the title, salary, and department.
- **Delete Role**: Delete a role from the database.
- **View Departments**: Display all departments in a table format with their ID and name.
- **Add Department**: Add a new department by specifying the department's name.

## Technologies Used

- **Node.js**: JavaScript runtime for building the CLI.
- **TypeScript**: Typed JavaScript that helps catch errors at compile time.
- **PostgreSQL**: Relational database to store employee, role, and department data.
- **Inquirer.js**: A powerful library used to prompt users in the command-line interface.
- **figlet**: A package that generates ASCII text art, used to display the "Employee Manager" banner.
- **dotenv**: For managing environment variables (like database credentials).

## Installation

### Prerequisites

Make sure you have the following installed on your machine:

1. **Node.js**: [Download Node.js](https://nodejs.org/)
2. **PostgreSQL**: [Download PostgreSQL](https://www.postgresql.org/download/)
3. **npm** (Node package manager): Included with Node.js

### Steps

1. Clone the repository to your local machine:

    ```bash
    git clone https://github.com/your-repo/employee-manager-cli.git
    ```

2. Navigate to the project directory:

    ```bash
    cd employee-manager-cli
    ```

3. Install the project dependencies:

    ```bash
    npm install
    ```

4. Set up the **PostgreSQL** database:

    - Create a database called `employee_manager_db` (or any name of your choice).
    - Create the following tables in the database:

    ```sql
    CREATE TABLE department (
      id SERIAL PRIMARY KEY,
      name VARCHAR(30) UNIQUE NOT NULL
    );

    CREATE TABLE role (
      id SERIAL PRIMARY KEY,
      title VARCHAR(30) UNIQUE NOT NULL,
      salary DECIMAL NOT NULL,
      department_id INTEGER NOT NULL,
      FOREIGN KEY (department_id) REFERENCES department(id)
    );

    CREATE TABLE employee (
      id SERIAL PRIMARY KEY,
      first_name VARCHAR(30) NOT NULL,
      last_name VARCHAR(30) NOT NULL,
      role_id INTEGER NOT NULL,
      manager_id INTEGER,
      FOREIGN KEY (role_id) REFERENCES role(id),
      FOREIGN KEY (manager_id) REFERENCES employee(id)
    );
    ```

5. Create a **`.env`** file in the root of your project with your database credentials:

    ```bash
    DB_USER=your_postgres_username
    DB_PASSWORD=your_postgres_password
    DB_HOST=localhost
    DB_NAME=employee_manager_db
    DB_PORT=5432
    ```

6. Compile the TypeScript code into JavaScript:

    ```bash
    npm run build
    ```

7. Run the application:

    ```bash
    node dist/index.js
    ```

## Questions

Email: margaretjenkins@gmail.com
#
GitHub: magsmags600

