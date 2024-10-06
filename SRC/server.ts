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

/** --- Additional Functionalities --- **/

// Update an employee's manager
app.put('/api/employees/:id/manager', async (req: Request, res: Response) => {
  const { id } = req.params;
  const { manager_id } = req.body;
  try {
    const result = await pool.query(
      'UPDATE employee SET manager_id = $1 WHERE id = $2 RETURNING *',
      [manager_id, id]
    );
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// View employees by manager
app.get('/api/employees/manager/:manager_id', async (req: Request, res: Response) => {
  const { manager_id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM employee WHERE manager_id = $1',
      [manager_id]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// View employees by department
app.get('/api/employees/department/:department_id', async (req: Request, res: Response) => {
  const { department_id } = req.params;
  try {
    const result = await pool.query(`
      SELECT e.id, e.first_name, e.last_name, role.title, department.name AS department
      FROM employee e
      JOIN role ON e.role_id = role.id
      JOIN department ON role.department_id = department.id
      WHERE department.id = $1
    `, [department_id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete a department
app.delete('/api/departments/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM department WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ message: 'Department deleted successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete a role
app.delete('/api/roles/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM role WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Role not found' });
    }
    res.json({ message: 'Role deleted successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// Delete an employee
app.delete('/api/employees/:id', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM employee WHERE id = $1 RETURNING *', [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Employee not found' });
    }
    res.json({ message: 'Employee deleted successfully', data: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
});

// View total utilized budget of a department
app.get('/api/departments/:id/budget', async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await pool.query(`
      SELECT department.name, SUM(role.salary) AS total_budget
      FROM employee
      JOIN role ON employee.role_id = role.id
      JOIN department ON role.department_id = department.id
      WHERE department.id = $1
      GROUP BY department.name
    `, [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: 'Department not found' });
    }
    res.json({ department: result.rows[0].name, total_budget: result.rows[0].total_budget });
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
