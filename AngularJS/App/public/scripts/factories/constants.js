/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: constants.js
 */

'use strict';

angular.module('CoesApp').factory('constants', function() {
	return {
		FIELD_NAMES : ['tipo de nota', 'publicity'],

		EDITION : 'Edición',
		FEELING : 'Sentimiento',
		SIZE : 'Tamaño',

		SERVICE_TYPE_DEFAULT: 'Noticia,Publicidad,Redes Sociales',
		LENGTH : 'Duración',
		
		TV : '#tv',
    	RADIO : '#radio',
    	PERIODICO : '#prensa-escrita',
    	REVISTA : '#revista',
    	INTERNET : '#internet',

    	STATE_COMPLETE : 'Completo',
    	STATE_INCOMPLETE: 'Incompleto',
    	STATE_NO_SEND: 'No Envío',
    	STATE_DASHBOARD: 'Dashboard',
    	STATE_ALL: 'Todas'
	};
});