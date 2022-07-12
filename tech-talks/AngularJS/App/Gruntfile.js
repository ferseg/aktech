
'use strict';

module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    watch: {
      js: {
        files: ['controllers/{,*/}*.js', 'models/{,*/}*.js', 'config.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
    },
    jshint: {
      options: {
        reporter: require('jshint-stylish')
      },
      all: []
    },
    'ftp-deploy': {
        build: {
          auth: {
            host: '192.168.10.16',
            port: 21,
            authKey: 'key1'
          },
          src: '.',
          dest: '/home/isadmin/COES',
          exclusions: ['./node_modules/grunt*']
        }
    }  
  });

  // Load the plugins
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  // Default task
  grunt.registerTask('default', ['watch']);
  grunt.registerTask('deploy', [
    'ftp-deploy'  
  ]);
};