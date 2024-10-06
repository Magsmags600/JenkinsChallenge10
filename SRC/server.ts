import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import pkg from 'pg';
const { Pool } = pkg;

// Load environment variables from .env file
dotenv.config();

// Create a connection pool to PostgreSQL using environment variables
const pool = new Pool({
  user: process.env.DB_USER,         // PostgreSQL username
  password: process.env.DB_PASSWORD, // PostgreSQL password
  host: 'localhost',                 // Database host (typically localhost)
  database: process.env.DB_NAME,     // PostgreSQL database name
  port: 5432,                        // Default PostgreSQL port
});

const app = express();
app.use(bodyParser.json());

// Route to view all departments
app.get('/api/departments', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT id, name FROM department');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to view all roles
app.get('/api/roles', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT role.id, role.title, department.name AS department, role.salary
      FROM role
      JOIN department ON role.department_id = department.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to view all employees
app.get('/api/employees', async (_req: Request, res: Response) => {
  try {
    const result = await pool.query(`
      SELECT e.id, e.first_name, e.last_name, role.title AS job_title, 
             department.name AS department, role.salary, 
             CONCAT(m.first_name, ' ', m.last_name) AS manager
      FROM employee e
      JOIN role ON e.role_id = role.id
      JOIN department ON role.department_id = department.id
      LEFT JOIN employee m ON e.manager_id = m.id
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to add a department
app.post('/api/departments', async (req: Request, res: Response) => {
  const { name } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO department (name) VALUES ($1) RETURNING *',
      [name]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to add a role
app.post('/api/roles', async (req: Request, res: Response) => {
  const { title, salary, department_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *',
      [title, salary, department_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to add an employee
app.post('/api/employees', async (req: Request, res: Response) => {
  const { first_name, last_name, role_id, manager_id } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *',
      [first_name, last_name, role_id, manager_id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Route to update an employee role
app.put('/api/employees/:id/role', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { role_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *',
      [role_id, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Start the server on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
