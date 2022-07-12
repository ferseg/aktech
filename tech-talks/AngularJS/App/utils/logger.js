/**
 * @fileOverview A collection of logs functionalities
 * @name logger
 */

//Adding timestamps to server logs
["log", "warn", "error"].forEach(function(method) {
    console[method] = console[method].bind(console, "["+ new Date().toUTCString() + "] - ");
});