/*
 * grunt-git-push
 * https://github.com/khatastroffik/grunt-git-push
 *
 * Copyright (c) 2020 Loïs Bégué
 * 
 * Licensed under the MIT license.
 */

/**
 * TODO: implement special flags -> "recurse-submodules", "force-with-lease"...
 */

'use strict';

var async = require('grunt').util.async;
var grunt = require('grunt');

// declare the default configuration, imcuding "push" specific flags
var DEFAULT_OPTIONS = {
  flags: {
    all: false,
    tags : false,
    force: false,
    atomic: false,
    delete: false,
    prune: false,
    signed: false,
    ipv4: false,
    ipv6: false,
    quiet: false,
    "dry-run": false,
    "follow-tags": false,
    "no-verify": false,
    "set-upstream": false,
    "push-option": false,
    "receive-pack": false
  },
  remote: 'origin',
  branch: 'master',
  cwd: '',
  verbose: false,
  debug: false,
  continueIfError: false
};

module.exports = function (grunt) {

  grunt.registerMultiTask('git_push', 'push changes to repository branch', function () {
    
    // initialize some variables
    var done = this.async();
    var taskOptions = this.options( {...DEFAULT_OPTIONS} );
    var spawnOptions = {};
    var pushArguments = ['push'];
    var taskName = this.name;
    var taskTarget = this.target;

    // deep merge the flags if the target defines some and if task default options exist, since grunt does not do deep copy of options (it only shallow copy the defaultObj options)
    if (this.options().flags && grunt.config('git_push').options && grunt.config('git_push').options.flags) {
      var mergedFlags = { ...DEFAULT_OPTIONS.flags, ...grunt.config('git_push').options.flags, ...this.options().flags };
      taskOptions = { ...taskOptions, flags: mergedFlags };
    }

    // spread default flags if not defined in calling task
    for (const flag in DEFAULT_OPTIONS.flags) {
      if (taskOptions.flags && !taskOptions.flags.hasOwnProperty(flag)) {
        taskOptions.flags[flag] = DEFAULT_OPTIONS.flags[flag];
      }
    }

    // check for CLI parameters (only dry-run, verbose and debug). Note: if one of these is set in the configuration, it won't be overriden by the CLI when set to false in CLI!
    taskOptions.verbose = (grunt.option('verbose')==true) || taskOptions.verbose;
    taskOptions.debug = (grunt.option('debug')==true) || taskOptions.debug;
    taskOptions.flags["dry-run"] = (grunt.option('dry-run')==true) || taskOptions.flags["dry-run"];

    // generate push arguments
    for (const flag in taskOptions.flags) {
      if (taskOptions.flags.hasOwnProperty(flag) && taskOptions.flags[flag]) {
        if (typeof taskOptions.flags[flag] === 'string') {
          // flags may contain strings
          pushArguments.push(`--${flag}='${taskOptions.flags[flag]}'`);        
        } else {
          // otherwise they'd contain a boolean
          pushArguments.push(`--${flag}`);        
        }
      }
    }
    if (taskOptions.remote) { pushArguments.push(taskOptions.remote); }
    if (taskOptions.branch) { pushArguments.push(taskOptions.branch); }
    
    // generate spawn options
    if (taskOptions.cwd) {
      if (grunt.file.isDir(taskOptions.cwd)) {
        spawnOptions.cwd = taskOptions.cwd;
      } else {
        done(new Error('The specified cwd does not exist: "' + taskOptions.cwd  + '"'));
        return;
      }
    }

    // inform user when DRY-RUN
    if (taskOptions.flags["dry-run"]) {
      grunt.log.ok('DRY-RUN');
    }

    // do the work i.e. call git !
    grunt.util.spawn(
      {
        cmd: 'git',
        args: pushArguments,
        opts: spawnOptions
      }, 
      function (error, result, code) {
        if (taskOptions.debug) { 
          grunt.log.ok('Task: ', taskName);
          grunt.log.ok('Target: ', taskTarget);
          grunt.log.ok('Options: \n', taskOptions);
          grunt.log.ok('Spawn Options: \n', spawnOptions);
        }
        
        if (code>0) {
          // handle error
          var msg = `Command: git ${pushArguments.join(' ')}\n${error.message}\n`;
          if (taskOptions.continueIfError) {
            grunt.log.error( `!!! ERROR !!!\n${msg}\nProceeding with next task, since \"continueIfError\" was set`);
            done();
          } else {
            done(new Error( msg ));
          }
        } else {
          // everything is fine
          if (taskOptions.debug) { 
            grunt.log.ok(`Command: git ${pushArguments.join(' ')}`);
          }
          if (taskOptions.verbose) {
            grunt.log.ok(`${result.stderr}\n`);
          }
          grunt.log.ok();
          done();
        }
      }
    );          
  });
};
