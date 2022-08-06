-- ========================
-- ROLES
-- ========================
INSERT INTO core_roles (
  RoleId,
  RoleCode)
VALUES
(1, 'ROLE_USER'),
(2, 'ROLE_ADMIN')  AS new
ON DUPLICATE KEY UPDATE RoleCode = new.RoleCode;


-- ========================
-- USERS
-- ========================
CALL TestSPCreateUser(1, 'user1', '', 1, 'user123');
CALL TestSPCreateUser(2, 'user2', '', 1, 'user123');
CALL TestSPCreateUser(3, 'user3', '', 1, 'user123');
CALL TestSPCreateUser(4, 'admin1', '', 2, 'admin123');
CALL TestSPCreateUser(5, 'admin2', '', 2, 'admin123');
CALL TestSPCreateUser(6, 'admin3', '', 2, 'admin123');
