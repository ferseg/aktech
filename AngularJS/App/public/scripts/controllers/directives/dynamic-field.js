/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: dynamic-field.js
 */

'use strict';

angular.module('CoesApp').controller('DynamicFieldController', function ($scope, FieldsTypeService) {

	var converter = {};
	$scope.value = {};
	$scope.currentDate = {};
	$scope.openDatePicker = false;

	$scope.getUnderscoreName = function() {
		return $scope.fieldInformation.name.split(' ').join('_') + '-field';
	};

	$scope.closeDatePicker = function() {
		$scope.openDatePicker = !$scope.openDatePicker;
	};

	$scope.$watch('value.definitive', function() {
		$scope.ngModel = $scope.value.definitive;
	});

	$scope.$watch('ngModel', function() {
		$scope.value.definitive = $scope.ngModel;
	});

	var defaultConverter = function(pValue) {
		return pValue;
	};

	var convertDate = function(pValue) {
		if (isNaN(Date.parse(pValue))) {
			return new Date();
		}
		return new Date(pValue);
	};

	var convertDateTime = function(pValue) {
		if (isNaN(Date.parse(pValue))) {
			return new Date();
		}
		return new Date(pValue);
	};

	var convertStringArray = function() {
		return null;
	};

	var setDefaultValue = function() {	
		converter[FieldsTypeService.INT] = parseInt;
		converter[FieldsTypeService.DECIMAL] = parseFloat;
		converter[FieldsTypeService.MONEY] = parseFloat;
		converter[FieldsTypeService.STRING] = defaultConverter;
		converter[FieldsTypeService.DATE] = convertDate;
		converter[FieldsTypeService.DATETIME] = convertDateTime;
		converter[FieldsTypeService.TIME] = defaultConverter;
		converter[FieldsTypeService.STRING_ARRAY] = convertStringArray;

		$scope.value.definitive = converter[$scope.fieldInformation.fieldType]($scope.fieldInformation.defaultValue);
	};

	var init = function() {
		if ($scope.fieldInformation.fieldType === FieldsTypeService.STRING_ARRAY) {
			$scope.radioElements = $scope.fieldInformation.defaultValue.split(',');
		}
		if ($scope.ngModel) {
			$scope.value.definitive = $scope.ngModel;
		} else {
			setDefaultValue();
		}
		
	};

	init();
});