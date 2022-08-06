DELIMITER //
DROP PROCEDURE IF EXISTS GetUserData //
CREATE PROCEDURE GetUserData(
  IN pUserIdentifier VARCHAR(50),
  OUT pUserId INT,
  OUT pRoleId INT,
  OUT pInstitutionId INT
)
BEGIN
  
  SELECT users.UserId, roles.RoleId, users.InstitutionId INTO pUserId, pRoleId, pInstitutionId
  FROM core_users users
  INNER JOIN core_userroles roles ON users.UserId = roles.UserId
  WHERE (users.Email = pUserIdentifier OR users.Username = pUserIdentifier)
  AND users.Deleted = 0
  AND users.Enabled = 1
  AND roles.Deleted = 0;

END //
