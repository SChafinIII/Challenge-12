-- Adds values to department. 
INSERT INTO department (name)
VALUES 
('Sales & Finances'),
('Marketing'),
('Human Resources');

-- Adds values to roles

INSERT INTO role (title, salary, department_id)
VALUES
('Sales Lead', 20000, 1),
('Marketing Lead', 40000, 2),
('HR Lead', 50000, 3);

-- Adds values to employee

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES
('Dave', 'Miller', 1, null),
('Steve', 'Rogers', 2, 2), 
('Ava', 'Ayaala', 3, null);