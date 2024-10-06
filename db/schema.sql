-- Create the movies_db database
CREATE DATABASE IF NOT EXISTS Challenge10_db;

-- Use the movies_db database
USE CHallenge10_db;

-- Table: department
CREATE TABLE department (
    id SERIAL PRIMARY KEY,
    name VARCHAR(30) UNIQUE NOT NULL
);

-- Table: role
CREATE TABLE role (
    id SERIAL PRIMARY KEY,
    title VARCHAR(30) UNIQUE NOT NULL,
    salary DECIMAL NOT NULL,
    department_id INTEGER NOT NULL,
    CONSTRAINT fk_department
        FOREIGN KEY(department_id) 
        REFERENCES department(id) 
        ON DELETE CASCADE
);

-- Table: employee
CREATE TABLE employee (
    id SERIAL PRIMARY KEY,
    first_name VARCHAR(30) NOT NULL,
    last_name VARCHAR(30) NOT NULL,
    role_id INTEGER NOT NULL,
    manager_id INTEGER,
    CONSTRAINT fk_role
        FOREIGN KEY(role_id) 
        REFERENCES role(id) 
        ON DELETE CASCADE,
    CONSTRAINT fk_manager
        FOREIGN KEY(manager_id) 
        REFERENCES employee(id)
);
