DELIMITER //
DROP PROCEDURE IF EXISTS ${schemaName}.CoreSPTestAddEntityCount //
CREATE PROCEDURE ${schemaName}.CoreSPTestAddEntityCount(
  IN pEntityCount INT,
  IN pDescription VARCHAR(255)
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
  
  SELECT
    1 AS Id,
    pEntityCount + 100 AS EntityCount,
    pDescription AS Description;

END //
