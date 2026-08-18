CREATE DATABASE IF NOT EXISTS collegecrm;

USE collegecrm;

CREATE TABLE IF NOT EXISTS students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    course VARCHAR(100),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

INSERT INTO students (name, email, course)
VALUES
('Rahul Kumar', 'rahul@example.com', 'Computer Science'),
('Priya Sharma', 'priya@example.com', 'Information Science'),
('Arun Kumar', 'arun@example.com', 'Electronics');
