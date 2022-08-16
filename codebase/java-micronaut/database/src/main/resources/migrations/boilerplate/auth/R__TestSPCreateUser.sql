DELIMITER //
DROP PROCEDURE IF EXISTS ${schemaName}.TestSPCreateUser //
CREATE PROCEDURE ${schemaName}.TestSPCreateUser(
  IN pUserId INT,
  IN pUsername VARCHAR(50),
  IN pEmail VARCHAR(50),
  IN pRoleId INT,
  IN pPassword VARCHAR(50)
)
BEGIN  
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1 @err_no = MYSQL_ERRNO, @message = MESSAGE_TEXT;
    SET @type = @err_no;
    ROLLBACK;
    SELECT SUBSTRING(@message, 1, 128) INTO @message;
    RESIGNAL SET MESSAGE_TEXT = @message, CONSTRAINT_CATALOG=@type;
  END;
  
  START TRANSACTION;
  SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
  SET autocommit = 0;

  INSERT INTO core_users (
    UserId,
    Username,
    Email)
  VALUES (
    pUserId,
    pUsername,
    pEmail) AS new
  ON DUPLICATE KEY UPDATE
    Username = new.Username,
    Email = new.Email;

  INSERT INTO core_userroles (
    UserId,
    RoleId)
  VALUES (
    pUserId,
    pRoleId) AS new
  ON DUPLICATE KEY UPDATE 
    RoleId = new.RoleId;

  INSERT INTO core_userpasswords (
    UserPasswordId,
    UserId,
    Password)
  VALUES (
    pUserId,
    pUserId,
    SHA2(pPassword, 0)) AS new
  ON DUPLICATE KEY UPDATE 
    Password = new.Password;

  COMMIT;

END //
