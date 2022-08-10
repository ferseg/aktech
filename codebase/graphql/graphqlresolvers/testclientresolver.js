"use strict";
exports.__esModule = true;
exports.TestClientResolver = void 0;
// Define a variable to provide a resolver function for each API endpoint within the query
exports.TestClientResolver = {
    soyguapo: function (_a) {
        var name = _a.name;
        return name + " " + (Math.random() < 0.6 ? "eres guapo" : "no eres guapo");
    },
    hello: function () {
        return 'Hello world!';
    },
    miNombre: function () {
        return "rigo";
    }
};
module.exports = exports.TestClientResolver;
