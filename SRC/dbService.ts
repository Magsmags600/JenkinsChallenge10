import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config(); // Load environment variables from .env file

const { Pool } = pkg;

// Create a connection pool to PostgreSQL
const pool = new Pool({
  user: process.env.DB_USER,         // PostgreSQL username
  password: process.env.DB_PASSWORD, // PostgreSQL password
  host: process.env.DB_HOST,         // Database host (typically localhost)
  database: process.env.DB_NAME,     // PostgreSQL database name
  port: parseInt(process.env.DB_PORT || '5432', 10), // Default PostgreSQL port
});

// Function to fetch employees
export async function fetchEmployees() {
  try {
    const result = await pool.query(`
      SELECT e.id, e.first_name, e.last_name, r.title, r.salary, d.name AS department, 
             m.first_name AS manager_first_name, m.last_name AS manager_last_name
      FROM employee e
      JOIN role r ON e.role_id = r.id
      JOIN department d ON r.department_id = d.id
      LEFT JOIN employee m ON e.manager_id = m.id
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching employees:', error);
    throw error;
  }
}

// Function to fetch roles
export async function fetchRoles() {
  try {
    const result = await pool.query(`
      SELECT r.id, r.title, r.salary, d.name AS department
      FROM role r
      JOIN department d ON r.department_id = d.id
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching roles:', error);
    throw error;
  }
}

// Function to fetch departments
export async function fetchDepartments() {
  try {
    const result = await pool.query(`
      SELECT id, name
      FROM department
    `);
    return result.rows;
  } catch (error) {
    console.error('Error fetching departments:', error);
    throw error;
  }
}

// Function to add an employee to the database
export async function addEmployeeToDb(firstName: string, lastName: string, roleId: number, managerName: string | null) {
  try {
    let managerId = null;
    if (managerName) {
      const managerIdResult = await pool.query(
        `SELECT id FROM employee WHERE CONCAT(first_name, ' ', last_name) = $1`,
        [managerName]
      );
      if (managerIdResult.rows.length > 0) {
        managerId = managerIdResult.rows[0].id;
      }
    }

    const result = await pool.query(
      `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *`,
      [firstName, lastName, roleId, managerId]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error adding employee:', error);
    throw error;
  }
}

// Function to update an employee's role in the database
export async function updateEmployeeRoleInDb(employeeId: number, roleId: number) {
  try {
    const result = await pool.query(
      `UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *`,
      [roleId, employeeId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error updating employee role:', error);
    throw error;
  }
}

// Function to delete an employee from the database
export async function deleteEmployeeFromDb(employeeId: number) {
  try {
    // Step 1: Update employees who report to the employee being deleted
    await pool.query(
      `UPDATE employee SET manager_id = NULL WHERE manager_id = $1`,
      [employeeId]
    );

    // Step 2: Delete the employee
    const result = await pool.query(
      `DELETE FROM employee WHERE id = $1 RETURNING *`,
      [employeeId]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error deleting employee:', error);
    throw error;
  }
}

// Function to add a role to the database
export async function addRoleToDb(title: string, salary: number, departmentId: number) {
  try {
    const result = await pool.query(
      `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *`,
      [title, salary, departmentId]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding role:', error);
    throw error;
  }
}

// Function to delete a role from the database
export async function deleteRoleFromDb(roleId: number) {
  try {
    // Step 1: Set role_id to NULL for employees who are assigned this role
    await pool.query(
      `UPDATE employee SET role_id = NULL WHERE role_id = $1`,
      [roleId]
    );

    // Step 2: Delete the role
    const result = await pool.query(
      `DELETE FROM role WHERE id = $1 RETURNING *`,
      [roleId]
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error deleting role:', error);
    throw error;
  }
}

// Function to add a department to the database
export async function addDepartmentToDb(name: string) {
  try {
    const result = await pool.query(
      `INSERT INTO department (name) VALUES ($1) RETURNING *`,
      [name]
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error adding department:', error);
    throw error;
  }
}
