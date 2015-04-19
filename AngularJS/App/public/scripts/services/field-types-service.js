/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: field-types.js
 */

angular.module('CoesApp').service('FieldsTypeService', function(generalSettings, request) {
	/*
	Supported field types
	 */
	this.INT = 'Número entero';
	this.DECIMAL = 'Número decimal';
	this.MONEY = 'Moneda';
	this.DATE = 'Fecha';
	this.DATETIME = 'Fecha y hora';
	this.TIME = 'Tiempo';
	this.STRING = 'Texto';
	this.STRING_ARRAY = 'Lista de items';

	this.fieldTypes = [
		this.INT,
		this.DECIMAL,
		this.MONEY,
		this.DATE,
		this.DATETIME,
		this.STRING,
		this.STRING_ARRAY,
		this.TIME
	];
});