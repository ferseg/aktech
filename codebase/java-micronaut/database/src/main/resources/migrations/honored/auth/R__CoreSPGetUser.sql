DELIMITER //
DROP PROCEDURE IF EXISTS CoreSPGetUser //
CREATE PROCEDURE CoreSPGetUser(
  IN pUserIdentifier VARCHAR(50)
)
BEGIN  
  
  DECLARE INVALID_USER_ERROR INT DEFAULT(51002);
  DECLARE INVALID_USER VARCHAR(50) DEFAULT 'The user is invalid';
  
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1 @err_no = MYSQL_ERRNO, @message = MESSAGE_TEXT;
    SET @type = @err_no;
    ROLLBACK;
    SELECT SUBSTRING(@message, 1, 128) INTO @message;
    RESIGNAL SET MESSAGE_TEXT = @message, CONSTRAINT_CATALOG=@type;
  END;

  SET @userId = NULL;
  SET @roleId = NULL;
  SET @userInstitutionId = NULL;

  CALL GetUserData(pUserIdentifier, @userId, @roleId, @userInstitutionId);
  
  IF ISNULL(@userId) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = INVALID_USER_ERROR, MESSAGE_TEXT = INVALID_USER;
  END IF;

  SELECT
    @userId AS Id,
    @roleId AS RoleId,
    @userInstitutionId AS InstitutionId;

END //
DELIMITER ;
