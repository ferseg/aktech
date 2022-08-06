
DELIMITER //
DROP PROCEDURE IF EXISTS CoreSPCreateTemporaryPassword //
CREATE PROCEDURE  CoreSPCreateTemporaryPassword(
  IN pUsername VARCHAR(255),
  IN pPassword VARCHAR(255)
)
BEGIN
  DECLARE ACCOUNT_DISABLED_ERROR INT DEFAULT(51001);
  DECLARE USER_DOES_NOT_EXIST_ERROR INT DEFAULT(51002);
  DECLARE NEW_PASSWORD_INVALID_ERROR INT DEFAULT(51003);
  
  DECLARE ACCOUNT_DISABLED VARCHAR(100) DEFAULT 'The account is disabled';
  DECLARE USER_DOES_NOT_EXIST VARCHAR(100) DEFAULT 'User does not exist';
  DECLARE NEW_PASSWORD_INVALID VARCHAR(100) DEFAULT 'New password invalid';
  
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1 @err_no = MYSQL_ERRNO, @message = MESSAGE_TEXT;
    SET @type = @err_no;
    ROLLBACK;
    SELECT SUBSTRING(@message, 1, 128) INTO @message;
    RESIGNAL SET MESSAGE_TEXT = @message, CONSTRAINT_CATALOG = @type;
  END;
  
  START TRANSACTION;
  
  SET @userId = NULL;
  SET @enabled = NULL;
  
  -- fetch the userId from the userName
  SELECT UserId, Enabled INTO @userId, @enabled
  FROM core_users users
  WHERE Username = pUsername
  AND Deleted = 0;
 
  -- only proceed if the user exists
  IF ISNULL(@userId) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = USER_DOES_NOT_EXIST_ERROR, MESSAGE_TEXT = USER_DOES_NOT_EXIST;
  END IF;
  
  
  -- only proceed if the user is enabled 
  IF (@enabled = 0) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = ACCOUNT_DISABLED_ERROR, MESSAGE_TEXT = ACCOUNT_DISABLED;
  END IF;
 
  IF ISNULL(pPassword) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = NEW_PASSWORD_INVALID_ERROR, MESSAGE_TEXT = NEW_PASSWORD_INVALID;
  END IF;

  IF CHAR_LENGTH(pPassword) < 3 THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = NEW_PASSWORD_INVALID_ERROR, MESSAGE_TEXT = NEW_PASSWORD_INVALID;
  END IF;
  
  -- update the db to expire the old password(s) for the user
  UPDATE core_userpasswords 
  SET Enabled = 0 
  WHERE UserId = @userId;
  
  -- insert a row with the new password and set the flag
  -- that the password must be changed on the next login
  INSERT INTO core_userpasswords
  (UserId, Password, ChangePasswordToken) 
  VALUES 
  (@userId, SHA2(pPassword, 0), SHA2(CAST(NOW() AS CHAR), 0));
 
  
  COMMIT;

END //
