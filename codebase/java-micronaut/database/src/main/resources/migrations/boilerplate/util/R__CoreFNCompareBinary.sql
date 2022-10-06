
DELIMITER //
DROP FUNCTION IF exists ${schemaName}.CoreFNCompareBinary //
CREATE FUNCTION ${schemaName}.CoreFNCompareBinary
(
  pValue1 BINARY(255),
  pValue2 BINARY(255)
)
RETURNS BIT DETERMINISTIC
BEGIN
  RETURN TRIM(CAST(pValue1 AS CHAR(255))) = TRIM(CAST(pValue2 AS CHAR(255)));
END //
