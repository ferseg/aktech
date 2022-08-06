
DELIMITER //
DROP PROCEDURE IF EXISTS CoreSPChangePassword //
CREATE PROCEDURE  CoreSPChangePassword(
  IN pUsername VARCHAR(255),
  IN pTemporaryPassword VARCHAR(255),
  IN pNewPassword VARCHAR(255),
  IN pChangePasswordToken VARCHAR(255)
)
BEGIN
  DECLARE ACCOUNT_DISABLED_ERROR INT DEFAULT(51001);
  DECLARE USER_DOES_NOT_EXIST_ERROR INT DEFAULT(51002);
  DECLARE NEW_PASSWORD_INVALID_ERROR INT DEFAULT(51003);
  DECLARE CHANGE_PASSWORD_CREDENTIALS_INVALID_ERROR INT DEFAULT(51004);
  DECLARE CHANGE_PASSWORD_TOKEN_INVALID_ERROR INT DEFAULT(51005);

  DECLARE ACCOUNT_DISABLED VARCHAR(100) DEFAULT 'The account is disabled';
  DECLARE USER_DOES_NOT_EXIST VARCHAR(100) DEFAULT 'User does not exist';
  DECLARE NEW_PASSWORD_INVALID VARCHAR(100) DEFAULT 'New password invalid';
  DECLARE CHANGE_PASSWORD_CREDENTIALS_INVALID VARCHAR(100) DEFAULT 'Change password credentials invalid';
  DECLARE CHANGE_PASSWORD_TOKEN_INVALID VARCHAR(100) DEFAULT 'Change password token invalid';

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
  SET @canChangePassword = NULL;

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

  IF CHAR_LENGTH(pChangePasswordToken) < 5 THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = CHANGE_PASSWORD_TOKEN_INVALID_ERROR, MESSAGE_TEXT = CHANGE_PASSWORD_TOKEN_INVALID;
  END IF;

  SELECT UserPasswordId INTO @canChangePassword
  FROM core_userpasswords
  WHERE UserId = @userId 
  AND CoreFNCompareBinary(Password, SHA2(pTemporaryPassword, 0))
  AND ChangePasswordToken = pChangePasswordToken
  AND Enabled = 1;

  -- only proceed if the temporary password and change password token are correct
  IF ISNULL(@canChangePassword) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = CHANGE_PASSWORD_CREDENTIALS_INVALID_ERROR, MESSAGE_TEXT = CHANGE_PASSWORD_CREDENTIALS_INVALID;
  END IF;

 
  IF ISNULL(pNewPassword) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = NEW_PASSWORD_INVALID_ERROR, MESSAGE_TEXT = NEW_PASSWORD_INVALID;
  END IF;

  IF CHAR_LENGTH(pNewPassword) < 4 THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = NEW_PASSWORD_INVALID_ERROR, MESSAGE_TEXT = NEW_PASSWORD_INVALID;
  END IF;
  
  -- update the db to expire the old password(s) for the user
  UPDATE core_userpasswords 
  SET Enabled = 0 
  WHERE UserId = @userId;
  
  INSERT INTO core_userpasswords
  (UserId, Password, Enabled) 
  VALUES 
  (@userId, SHA2(pNewPassword, 0), 1);
 
  
  COMMIT;

END //
