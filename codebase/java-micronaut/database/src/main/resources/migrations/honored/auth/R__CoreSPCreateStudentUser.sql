DELIMITER //
DROP PROCEDURE IF EXISTS CoreSpCreateStudentUser //
CREATE PROCEDURE CoreSpCreateStudentUser(
  IN pUsername VARCHAR(50),
  IN pPassword VARCHAR(50),
  IN pInstitutionName VARCHAR(50),
  IN pFirstName VARCHAR(50),
  IN pLastName VARCHAR(50)
)
BEGIN  

  DECLARE INVALID_INSTITUTION_NAME_ERROR INT DEFAULT(52001);
  DECLARE INVALID_INSTITUTION_NAME VARCHAR(50) DEFAULT 'The institution name is invalid';
  
  DECLARE EXIT HANDLER FOR SQLEXCEPTION
  BEGIN
    GET DIAGNOSTICS CONDITION 1 @err_no = MYSQL_ERRNO, @message = MESSAGE_TEXT;
    SET @type = @err_no;
    ROLLBACK;
    SELECT SUBSTRING(@message, 1, 128) INTO @message;
    RESIGNAL SET MESSAGE_TEXT = @message, CONSTRAINT_CATALOG=@type;
  END;


  SET @userID = NULL;
  SET @institutionId = NULL;
  SET @studentRoleId = 1;

  SELECT InstitutionId INTO @institutionId
  FROM core_institutions
  WHERE Name = pInstitutionName;

  IF ISNULL(@institutionId) THEN
    SIGNAL SQLSTATE '45000' SET MYSQL_ERRNO = INVALID_INSTITUTION_NAME_ERROR, MESSAGE_TEXT = INVALID_INSTITUTION_NAME;
  END IF;

  START TRANSACTION;
  SET SESSION TRANSACTION ISOLATION LEVEL READ COMMITTED;
  SET autocommit = 0;

  INSERT INTO core_users
  (Username,
   InstitutionId,
   FirstName,
   LastName)
  VALUES
  (pUsername,
   @institutionId,
   pFirstName,
   pLastName);

  SELECT LAST_INSERT_ID() INTO @userId;

  INSERT INTO core_userroles
  (UserId,
   RoleId)
  VALUES
  (@userId,
   @studentRoleId);

  INSERT INTO core_userstudents
  (UserId)
  VALUES
  (@userId);
    
  INSERT INTO core_userpasswords
  (UserPasswordId,
   UserId,
   Password)
  VALUES
  (@userId, @userId, SHA2(pPassword, 0));

  COMMIT;

END //
