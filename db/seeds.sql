INSERT INTO department (name)
VALUES ('Security'), ('Finance'), ('Human Resources'), ('Culinary'), ('Front Office');

INSERT INTO role (title, salary, department_id)
VALUES ('Officer', '65000', (SELECT id FROM department WHERE name = 'Security')),
('Accountant', '90000', (SELECT id FROM department WHERE name = 'Finance')),
('Recruiter', '60000', (SELECT id FROM department WHERE name = 'Human Resources')),
('Chef', '73000', (SELECT id FROM department WHERE name = 'Culinary')),
('Cook', '44000', (SELECT id FROM department WHERE name = 'Culinary')),
('Receptionist', '52000', (SELECT id FROM department WHERE name = 'Front Office'));

INSERT INTO employee (first_name, last_name, role_id, manager_id)
VALUES ('Bob', 'Dent', (SELECT id FROM role WHERE title = 'Officer'), NULL),
('Kayla', 'Luc', (SELECT id FROM role WHERE title = 'Accountant'), NULL),
('Krishna', 'Seant', (SELECT id FROM role WHERE title = 'Recruiter'), NULL),
('Derek', 'Marchese', (SELECT id FROM role WHERE title = 'Chef'), NULL),
('Marcus', 'Rivera', (SELECT id FROM role WHERE title = 'Cook'), (SELECT * FROM (SELECT id FROM employee WHERE last_name = 'Marchese') AS x)),
('Shirley', 'Trussle', (SELECT id FROM role WHERE title = 'Receptionist'), NULL);