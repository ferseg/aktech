
DELIMITER //
DROP PROCEDURE IF EXISTS CoreSPLoginUser //
CREATE PROCEDURE CoreSPLoginUser(
  IN pUserIdentifier VARCHAR(50),
  IN pPassword VARCHAR(255)
)
BEGIN

  DECLARE UNAUTHENTICATED_ERROR INT DEFAULT(51000);
  DECLARE ACCOUNT_DISABLED_ERROR INT DEFAULT(51001);
  DECLARE UNAUTHORIZED_ERROR INT DEFAULT(53000);
  DECLARE UNAUTHENTICATED VARCHAR(50) DEFAULT 'The username or password is invalid';
  DECLARE ACCOUNT_DISABLED VARCHAR(100) DEFAULT 'The account is disabled';
  
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1 @err_no = MYSQL_ERRNO, @message = MESSAGE_TEXT;
    SET @type = @err_no;
    ROLLBACK;
    SELECT SUBSTRING(@message, 1, 128) INTO @message;
    RESIGNAL SET MESSAGE_TEXT = @message, CONSTRAINT_CATALOG = @type;
  END;
  
  SET @userId = NULL;
  SET @enabled = NULL;
  SET @passwordUserId = NULL;
  SET @changePasswordToken = NULL;
  
  SELECT
    UserId,
    Enabled
  INTO
    @userId,
    @enabled
  FROM core_users
  WHERE (Email = pUserIdentifier OR Username = pUserIdentifier)
  AND Deleted = 0;
  
  IF ISNULL(@userId) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = UNAUTHENTICATED_ERROR, MESSAGE_TEXT = UNAUTHENTICATED;
  END IF;
  
  IF (@enabled = 0) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = ACCOUNT_DISABLED_ERROR, MESSAGE_TEXT = ACCOUNT_DISABLED;
  END IF;
  
  SELECT 
    UserId,
    ChangePasswordToken
  INTO 
    @passwordUserId,
    @changePasswordToken
  FROM core_userpasswords
  WHERE UserId = @userId
  AND CoreFNCompareBinary(Password, SHA2(pPassword, 0))
  AND Enabled = 1;
  
  IF ISNULL(@passwordUserId) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = UNAUTHENTICATED_ERROR, MESSAGE_TEXT = UNAUTHENTICATED;
  END IF;
  
  SELECT
    RoleCode,
    @changePasswordToken AS 'changePasswordToken'
  FROM core_roles roles
  INNER JOIN core_userroles uroles ON roles.RoleId = uroles.RoleId
  INNER JOIN core_users users ON uroles.UserId = users.UserId
  WHERE users.UserId = @userId;

END //
