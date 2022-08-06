
DELIMITER //
DROP PROCEDURE IF EXISTS CoreSPGetUserWithRefreshToken //
CREATE PROCEDURE  CoreSPGetUserWithRefreshToken(
  IN pRefreshToken VARCHAR(2048)
)
BEGIN
  DECLARE UNAUTHENTICATED_ERROR INT DEFAULT(51000);
  DECLARE ACCOUNT_DISABLED_ERROR INT DEFAULT(51001);
  DECLARE INVALID_REFRESH_TOKEN_ERROR INT DEFAULT(51002);
  DECLARE UNAUTHORIZED_ERROR INT DEFAULT(53000);
  DECLARE UNAUTHENTICATED VARCHAR(50) DEFAULT 'The username or password is invalid';
  DECLARE ACCOUNT_DISABLED VARCHAR(100) DEFAULT 'The account is disabled';
  DECLARE INVALID_REFRESH_TOKEN VARCHAR(100) DEFAULT 'Invalid refresh token';
  
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1 @err_no = MYSQL_ERRNO, @message = MESSAGE_TEXT;
    SET @type = @err_no;
    ROLLBACK;
    SELECT SUBSTRING(@message, 1, 128) INTO @message;
    RESIGNAL SET MESSAGE_TEXT = @message, CONSTRAINT_CATALOG = @type;
  END;
  
  SET @userId = NULL;
  SET @refreshTokenId = NULL;
  SET @sessionId = NULL; 
  SET @userName = NULL;
  SET @userEnabled = NULL;
  SET @roleCodes = NULL;
  
  SELECT RefreshTokenId, UserId INTO @refreshTokenId, @userId
  FROM core_userrefreshtokens
  WHERE RefreshToken = pRefreshToken
  AND Enabled = 1
  AND ExpirationTime > NOW();
  
  IF ISNULL(@refreshTokenId) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = INVALID_REFRESH_TOKEN_ERROR, MESSAGE_TEXT = INVALID_REFRESH_TOKEN;
  END IF;
  
  SELECT SessionId INTO @sessionId
  FROM core_usersessions
  WHERE RefreshTokenId = @refreshTokenId;
  
  SELECT Username, Enabled INTO @userName, @userEnabled
  FROM core_users
  WHERE UserId = @userId
  AND Enabled = 1
  AND Deleted = 0;
  
  IF ISNULL(@userId) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = UNAUTHENTICATED_ERROR, MESSAGE_TEXT = UNAUTHENTICATED;
  END IF;
  
  IF (@userEnabled = 0) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = ACCOUNT_DISABLED_ERROR, MESSAGE_TEXT = ACCOUNT_DISABLED;
  END IF;
  
  SELECT RoleCode INTO @roleCodes
  FROM core_roles
  WHERE RoleId IN (
  	SELECT RoleId FROM core_userroles WHERE UserId = @userId
  );
  
  SELECT @userId AS UserId, @userName AS UserName, @sessionId AS SessionId, @roleCodes AS RoleCodes;
  
END //