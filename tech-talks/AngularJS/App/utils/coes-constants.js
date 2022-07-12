/*!
 * All Rights Reserved
 * This software is proprietary information of
 * Intelligent Sense
 * Use is subject to license terms.
 * Filename: coes-constants.js
 */

// Uses constants module
var define = require('../utils/consts.js')(exports);

/**
 * Configuration keys
 */
define('CONFIG_CONNECTION_STRING', 'connectionString');
define('CONFIG_PORTS', 'port');
define('CONFIG_ENABLE_CORS', 'enableCORS');


/**
 * Initializer configuration
 */
define('INIT_MODELS_FOLDER', './models');
// Indicates what a file must have to be considered as a model. For example, ending with "Model.js" in CarModel.js
// If every .js file inside the folder should be consider as a model, just leave .js
define('INIT_MODEL_IDENTIFIER', '.js');
define('INIT_CONTROLLERS_FOLDER', './controllers');
// Indicates what a file must have to be considered as a controller. 
// For example, ending with "Controller.js" in LoginController.js
// If every .js file inside the folder should be consider as a controller, just leave .js
define('INIT_CONTROLLERS_IDENTIFIER', '.js');

/**
 * Regular Expressions
 */
define('REGEXP_HASHTAG', '/(^#)(\w*)$/');

/**
 * Permissions
 */
define('ADMIN_PERMISSION', 'ADM');
define('SUPERVISOR_PERMISSION', 'SUP');

/**
 * Return Codes
 */

define('CODE_OK', 200);
define('CODE_ERROR', 400);
define('CODE_UNAUTHORIZED', 401);
define('CODE_SERVER_ERROR', 500);


/**
 * Error mesages
 */

define('ERROR', 'Error en la llamada');

define('ERROR_DATABASE', 'Tuvimos un problema con la base de datos. Por favor intente más tarde.');
define('ERROR_INVALID_HASHTAG', 'El hashtag no es válido');
define('ERROR_INVALID_HASHTAG_CLIENT', 'El hashtag del cliente no es válido');
define('ERROR_INVALID_HASHTAG_TRADEMARK', 'El hashtag de la marca no es válido');
define('ERROR_INVALID_HASHTAG_PRODUCT', 'El hashtag del producto no es válido');
define('ERROR_INVALID_TAG_FATHER', 'El hashtag padre no existe');
define('ERROR_INVALID_ID', 'El ID del objeto no existe');
define('ERROR_UPDATE_TAG', 'El hashtag no puede ser cambiado');
define('ERROR_HAS_SUBSECTORS', 'El sector tiene subsectores');
define('ERROR_GETTING_DATA', 'Error obteniendo datos, por favor intente más tarde');
define('ERROR_UPLOADING_FILE', 'Error subiendo archivo');
define('ERROR_SAVING_ARTICLES', 'Se ha producido un error al guardar el archivo');
define('ERROR_WITH_DATE', 'Verifique que la fecha no sea nula o incorrecta');
define('ERROR_INVALID_CLIENT', 'Verifique que el cliente sea válido');
define('ERROR_TITLE_OR_DESCRIPTION', 'Verifique que el título y la descripción estén completos');
define('ERROR_NO_USER', 'Error al recuperar el usuario activo');
define('ERROR_INVALID_ARTICLE', 'El artículo no existe');
define('ERROR_INVALID_HASHTAG_REPEAT', 'El tag ya existe, los tags deben ser únicos. Digite un tag distinto');
define('ERROR_GETTING_FILE', 'Ocurrió un error al mover el archivo adjunto de la carpeta en el servidor');

/**
 * Success messages
 */

define('SUCCESS_UPDATE', 'Modificación realizada');
define('SUCCESS_DELETE', 'Elemento eliminado');

/**
 * Tags codes collections
 */
define('CLIENTS_TAGS', 'clients');
define('TRADEMARKS_TAGS', 'trademarks');
define('PRODUCTS_TAGS', 'products');
define('MEDIATYPES_TAGS', 'media-types');
define('SECTORS_TAGS', 'sectors');
define('SPACES_TAGS', 'spaces');
define('COUNTRIES_TAGS', 'countries');
define('USERS_TAGS', 'users');


/**
 * File types
 */
define('WEB_FILE_TYPE', 'web');
define('VIDEO_FILE_TYPE', 'video');
define('IMAGE_FILE_TYPE', 'image');
define('AUDIO_FILE_TYPE', 'audio');

/**
 * NOTICE TYPES
 */
define('NOTICE', 'Noticia');
define('PUBLICITY', 'Publicidad');
define('SOCIAL', 'Redes Sociales');


/**
 * SENDGRID DATA
 */
define('FROM','info@coescomunicacion.com');
define('SUBJECT','Reporte de notas');


/**
 * FIELDS NAMES
 */
define('EDITION','Edición');


/**
 * STATE
 */
define('STATE_COMPLETE','Completo');
define('STATE_DASHBOARD','Dashboard');