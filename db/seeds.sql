-- Use the movies_db database
USE Challenge10_db;

-- Seeding the department table
INSERT INTO department (name)
VALUES 
    ('Engineering'),
    ('Human Resources'),
    ('Marketing'),
    ('Finance'),
    ('Sales');

-- Seeding the role table
INSERT INTO role (title, salary, department_id)
VALUES 
    ('Software Engineer', 80000, 1),   -- Engineering
    ('HR Manager', 70000, 2),          -- Human Resources
    ('Marketing Specialist', 60000, 3),-- Marketing
    ('Accountant', 65000, 4),          -- Finance
    ('Sales Manager', 75000, 5),       -- Sales
    ('Senior Engineer', 100000, 1);    -- Engineering

-- Seeding the employee table
INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES 
    ('Alice', 'Johnson', 1, NULL),       -- Software Engineer, No manager
    ('Bob', 'Smith', 2, NULL),           -- HR Manager, No manager
    ('Charlie', 'Brown', 3, NULL),       -- Marketing Specialist, No manager
    ('David', 'Wilson', 4, NULL),        -- Accountant, No manager
    ('Eve', 'Davis', 5, NULL),           -- Sales Manager, No manager
    ('Frank', 'Miller', 6, 1),           -- Senior Engineer, manager is Alice
    ('Grace', 'Lee', 1, 6),              -- Software Engineer, manager is Frank
    ('Hannah', 'Clark', 3, 3);           -- Marketing Specialist, manager is Charlie
