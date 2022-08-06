
DELIMITER //
DROP PROCEDURE IF EXISTS CoreSPRefreshSession //
CREATE PROCEDURE  CoreSPRefreshSession(
  IN pOldRefreshToken VARCHAR(2048),
  IN pSessionId INT,
  IN pUserId INT,
  IN pNewRefreshToken VARCHAR(2048),
  IN pNewAuthToken VARCHAR(2048)
)
BEGIN

  DECLARE INVALID_REFRESH_TOKEN_ERROR INT DEFAULT(51002);
  DECLARE REQUIRED_PARAMETER_MISSING_ERROR INT DEFAULT(51003);
  DECLARE UNAUTHORIZED_ERROR INT DEFAULT(53000);
  DECLARE INVALID_REFRESH_TOKEN VARCHAR(100) DEFAULT 'Invalid refresh token';
  DECLARE REQUIRED_PARAMETER_MISSING VARCHAR(100) DEFAULT 'Required input parameter missing';
  
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1 @err_no = MYSQL_ERRNO, @message = MESSAGE_TEXT;
    SET @type = @err_no;
    ROLLBACK;
    SELECT SUBSTRING(@message, 1, 128) INTO @message;
    RESIGNAL SET MESSAGE_TEXT = @message, CONSTRAINT_CATALOG = @type;
  END;
  
  -- validate the input 
  IF ISNULL(pOldRefreshToken) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = REQUIRED_PARAMETER_MISSING_ERROR, MESSAGE_TEXT = REQUIRED_PARAMETER_MISSING;
  END IF;
  
  IF ISNULL(pSessionId) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = REQUIRED_PARAMETER_MISSING_ERROR, MESSAGE_TEXT = REQUIRED_PARAMETER_MISSING;
  END IF;
  
  IF ISNULL(pNewRefreshToken) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = REQUIRED_PARAMETER_MISSING_ERROR, MESSAGE_TEXT = REQUIRED_PARAMETER_MISSING;
  END IF;
  
  IF ISNULL(pNewAuthToken) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = REQUIRED_PARAMETER_MISSING_ERROR, MESSAGE_TEXT = REQUIRED_PARAMETER_MISSING;
  END IF;
  
  IF ISNULL(pUserId) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = REQUIRED_PARAMETER_MISSING_ERROR, MESSAGE_TEXT = REQUIRED_PARAMETER_MISSING;
  END IF;
  
  START TRANSACTION;
  
  -- expire the old refresh token 
  UPDATE core_userrefreshtokens 
  SET ExpirationTime = NOW(), Enabled = 0 
  WHERE RefreshToken = pOldRefreshToken;
  
  -- insert the new refresh token 
  SET @newRefreshTokenExpiresAt = DATE_ADD(NOW(), INTERVAL 2 MONTH);
  
  INSERT INTO core_userrefreshtokens (
    UserId,
    RefreshToken,
    ExpirationTime)
  VALUES (
    pUserId,
    pNewRefreshToken,
    @newRefreshTokenExpiresAt);
  
  -- grab the id of the new refresh token 
  SET @newRefreshTokenId = NULL;
  SELECT LAST_INSERT_ID() INTO @newRefreshTokenId;
    
  -- insert a new session row
  INSERT INTO core_usersessions (
    RefreshTokenId,
    UserId,
    AccessToken)
  VALUES (
    @newRefreshTokenId,
    pUserId,
    pNewAuthToken);
  
  COMMIT;
  
END //