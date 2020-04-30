/*
 * grunt-git-push
 * https://github.com/khatastroffik/grunt-git-push
 *
 * Copyright (c) 2020 Loïs Bégué
 * 
 * Licensed under the MIT license.
 */

'use strict';

module.exports = function(grunt) {
  grunt.initConfig({
    jshint: {
      all: [
        'Gruntfile.js',
        'tasks/*.js',
        '<%= nodeunit.tests %>'
      ],
      options: {
        jshintrc: '.jshintrc'
      }
    },
    clean: {
      tests: ['tmp']
    },

    git_push: {
      options: {
        flags: {
          "dry-run": true,
        },
        verbose: true,
        debug: false,
        continueIfError: false
      },
      default: { 
        options: {
          flags: {
            "follow-tags": true,
            "no-verify": true
          }
        }
      }
    },
    nodeunit: {
      tests: ['test/*_test.js']
    }
  });

  grunt.loadTasks('tasks');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-nodeunit');

  grunt.registerTask('test', ['clean', 'git_push', 'nodeunit']);
  grunt.registerTask('default', ['jshint', 'test']);
};
