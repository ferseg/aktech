-- ========================
-- ROLES
-- ========================
INSERT INTO ${schemaName}.core_roles (
  RoleId,
  RoleCode)
VALUES
(1, 'ROLE_USER'),
(2, 'ROLE_ADMIN')  AS new
ON DUPLICATE KEY UPDATE RoleCode = new.RoleCode;


-- ========================
-- USERS
-- ========================
CALL ${schemaName}.TestSPCreateUser(1, 'user1', '', 1, 'user123');
CALL ${schemaName}.TestSPCreateUser(2, 'user2', '', 1, 'user123');
CALL ${schemaName}.TestSPCreateUser(3, 'user3', '', 1, 'user123');
CALL ${schemaName}.TestSPCreateUser(4, 'admin1', '', 2, 'admin123');
CALL ${schemaName}.TestSPCreateUser(5, 'admin2', '', 2, 'admin123');
CALL ${schemaName}.TestSPCreateUser(6, 'admin3', '', 2, 'admin123');

-- ========================
-- STUDENTS
-- ========================
INSERT INTO ${schemaName}.students (
    FirstName,
    MiddleName,
    LastName,
    Email)
VALUES
("Student1", "", "Student1 Lastname", "student1@test.com"),
("Student2", "", "Student2 Lastname", "student2@test.com"),
("Student3", "", "Student3 Lastname", "student3@test.com"),
("Student4", "", "Student4 Lastname", "student4@test.com"),
("Student5", "", "Student5 Lastname", "student5@test.com");
