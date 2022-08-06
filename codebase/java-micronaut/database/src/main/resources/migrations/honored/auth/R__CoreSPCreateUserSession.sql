
DELIMITER //
DROP PROCEDURE IF EXISTS CoreSPCreateUserSession //
CREATE PROCEDURE CoreSPCreateUserSession(
  IN pUserIdentifier VARCHAR(50),
  IN pAccessToken VARCHAR(2048),
  IN pRefreshToken VARCHAR(2048)
)
BEGIN

  DECLARE UNAUTHENTICATED_ERROR INT DEFAULT(51000);
  DECLARE UNAUTHORIZED_ERROR INT DEFAULT(53000);
  DECLARE UNAUTHENTICATED VARCHAR(50) DEFAULT 'The username or password is invalid';
  
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
  
  SELECT
    UserId INTO @userId
  FROM core_users
  WHERE (Email = pUserIdentifier OR Username = pUserIdentifier)
  AND Enabled = 1
  AND Deleted = 0;
  
  IF ISNULL(@userId) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = UNAUTHENTICATED_ERROR, MESSAGE_TEXT = UNAUTHENTICATED;
  END IF;
  
  SELECT
    RefreshTokenId INTO @refreshTokenId
  FROM core_userrefreshtokens
  WHERE RefreshToken = pRefreshToken
  AND UserId = @userId;
  
  START TRANSACTION;
  SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
  SET autocommit = 0;
  
  IF ISNULL(@refreshTokenId) THEN
    
    SET @expirationTime = DATE_ADD(NOW(), INTERVAL 2 MONTH);
    
    INSERT INTO core_userrefreshtokens (
      UserId,
      RefreshToken,
      ExpirationTime)
    VALUES (
      @userId,
      pRefreshToken,
      @expirationTime);
      
    SET @refreshTokenId = last_insert_id();

  END IF;
  
  INSERT INTO core_usersessions (
    RefreshTokenId,
    UserId,
    AccessToken)
  VALUES (
    @refreshTokenId,
    @userId,
    pAccessToken);

  COMMIT;

END //
