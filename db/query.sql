import express from 'express';
import { QueryResult } from 'pg';
import { pool, connectToDb } from './connection.js';

await connectToDb();

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Create a new department
app.post('/api/departments', ({ body }, res) => {
  const sql = `INSERT INTO department (name) VALUES ($1) RETURNING *`;
  const params = [body.name];

  pool.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: result.rows[0],
    });
  });
});

// Read all departments
app.get('/api/departments', (_req, res) => {
  const sql = `SELECT * FROM department`;

  pool.query(sql, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const { rows } = result;
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

// Create a new role
app.post('/api/roles', ({ body }, res) => {
  const sql = `INSERT INTO role (title, salary, department_id) VALUES ($1, $2, $3) RETURNING *`;
  const params = [body.title, body.salary, body.department_id];

  pool.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: result.rows[0],
    });
  });
});

// Read all roles
app.get('/api/roles', (_req, res) => {
  const sql = `
    SELECT role.id, role.title, role.salary, department.name AS department
    FROM role
    JOIN department ON role.department_id = department.id
  `;

  pool.query(sql, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const { rows } = result;
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

// Create a new employee
app.post('/api/employees', ({ body }, res) => {
  const sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ($1, $2, $3, $4) RETURNING *`;
  const params = [body.first_name, body.last_name, body.role_id, body.manager_id || null];

  pool.query(sql, params, (err, result) => {
    if (err) {
      res.status(400).json({ error: err.message });
      return;
    }
    res.json({
      message: 'success',
      data: result.rows[0],
    });
  });
});

// Read all employees
app.get('/api/employees', (_req, res) => {
  const sql = `
    SELECT e.id, e.first_name, e.last_name, role.title AS job_title, 
           department.name AS department, role.salary, 
           CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    JOIN role ON e.role_id = role.id
    JOIN department ON role.department_id = department.id
    LEFT JOIN employee m ON e.manager_id = m.id
  `;

  pool.query(sql, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
    const { rows } = result;
    res.json({
      message: 'success',
      data: rows,
    });
  });
});

// Update an employee's role
app.put('/api/employees/:id/role', (req, res) => {
  const sql = `UPDATE employee SET role_id = $1 WHERE id = $2 RETURNING *`;
  const params = [req.body.role_id, req.params.id];

  pool.query(sql, params, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.rowCount) {
      res.json({
        message: 'Employee not found',
      });
    } else {
      res.json({
        message: 'success',
        data: result.rows[0],
      });
    }
  });
});

// Delete an employee
app.delete('/api/employees/:id', (req, res) => {
  const sql = `DELETE FROM employee WHERE id = $1 RETURNING *`;
  const params = [req.params.id];

  pool.query(sql, params, (err: Error, result: QueryResult) => {
    if (err) {
      res.status(400).json({ error: err.message });
    } else if (!result.rowCount) {
      res.json({
        message: 'Employee not found',
      });
    } else {
      res.json({
        message: 'deleted',
        changes: result.rowCount,
        data: result.rows[0],
      });
    }
  });
});

// Default response for any other request (Not Found)
app.use((_req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
