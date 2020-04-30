# grunt-git-push

A Grunt task to execute "git push" commands

## Getting Started

This plugin requires **Grunt** `1.1.0` (it may work with some older versions, though not tested).

If you haven't used [Grunt](http://gruntjs.com/) before, please check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin following the instructions below.

## Conventional installation

This Grunt plugin should be installed as a development dependency of your project:

```shell
npm install --save-dev @khatastroffik/grunt-git-push
```

In your project's `Gruntfile.js`, add a section named `git_push` to the data object passed into `grunt.initConfig()`. At least one target (e.g. `test` below) must be defined. This target will be executed by default if no target is explicitly specified when the task is called:

```js
grunt.initConfig({

  //...

  git_push: {
    options: {
      // define the DEFAULT options for ALL targets here
    },
    release: {
      options: {
        // define the options SPECIFIC to THIS target here
      }
    },
    test: {
      options: {
        // define the options SPECIFIC to THAT target here
      }
    }
  },

  //...

});
```
note: if multiple targets are defined and the task call doesn't specify any target, then ALL the defined targets will be executed in a row.

To enable i.e. **load** the plugin, add the following inside your `Gruntfile.js` file (usually after the configuration above):

```js
// load the plugin
grunt.loadNpmTasks('grunt-git-push');
```

To integrate the task i.e. in order to have it called in some workflow, you may also define further (kind of *meta*) tasks like the following:

```js
grunt.registerTask('pushtest', ['git_push:test']); // call the git_push task with target 'test'
grunt.registerTask('test', ['clean', 'pushtest', 'nodeunit']); // call the 'pushtest' task above

grunt.registerTask('release', ['SOME-TASK-HERE', 'git_push:release', 'SOME-TASK-THERE']);
```

To make the grunt (meta) tasks available per npm, you may add some scripts in your `package.json`file. E.g.:

```json

"scripts": {
  "pushtest": "grunt pushtest",
  "test": "grunt test",
  "release": "grunt release"
}

```


## Options

### Grunt plugin specific option

There's are the specific options:
- **continueIfError** (default = `false`): if set to `true`, allows Grunt to proceed with the next task even if "git_push" has failed.
- **verbose** (defult = `false`): displays the executed `git push` command and its result.
- **debug** (default = `false`): displays the configuration of the currently executed "git_push" task.
- **cwd** (default = &lt;empty string&gt;): when the *current working directory* is specified (as string),  the "git push" command will be executed in this context.

### Git-push specific options

There are 2 different kind of parameters

1. git push **flags**: all the flags default to `false`. Most of them can be set to `true` to enable the flag. Few of the flags may contain a string value in order to be enabled. Those flags MUST be declared in a ** flag section** (see example below). 
1. git push **value parameters**: the values of those parameters will be passed as-is directly to the "git push" command. These param/values are defined at the **"options" root level**

### List of options

|section|value-Param/flag|default|
|---|---|---|
|&lt;root&gt;|remote|'origin'|
|&lt;root&gt;|branch|'master'|
|&lt;root&gt;|cwd|''|
|&lt;root&gt;|verbose|false|
|&lt;root&gt;|debug|false|
|&lt;root&gt;|continueIfError|false|
|flags|all|false|
|flags|tags |false|
|flags|force|false|
|flags|atomic|false|
|flags|delete|false|
|flags|prune|false|
|flags|signed|false|
|flags|ipv4|false|
|flags|ipv6|false|
|flags|quiet|false|
|flags|"dry-run"|false|
|flags|"follow-tags"|false|
|flags|"no-verify"|false|
|flags|"set-upstream"|false|
|flags|"push-option"|false|
|flags|"receive-pack"|false|


**IMPORTANT**: some flags require to be writen including the double quotes - as displayed in the table above and demonstrated in the example configuration below!

### Gruntfile Configuration Example

This is an example of the **git_push** task configuration using a target named "default".

(note the usage of the "all" flag, which requires the *remote* and *branch* parameters to be unset)

```js
grunt.initConfig({

  //...
  git_push: {
    options: {
      flags: {
        "dry-run": true,
      },
      verbose: true,
      debug: true,
      continueIfError: false
    },
    default: { 
      options: {
        flags: {
          all: true,
          ipv4: true,
          "follow-tags": true,
          "no-verify": true
        },
        remote: '',
        branch: '',
        continueIfError: false
      }
    }
  },
  //...

});
```

Executing the task `git_push` as defined above will result in executing the command (debug and verbose modes are "on") in DRYRUN as:

> `git push --all --ipv4 --follow-tags --no-verify`

and the ouput would be:

```txt
Running "git_push:default" (git_push) task
>> DRY-RUN
>> Task:  git_push
>> Target:  default
>> Options:
>>  {
>>   flags: {
>>     all: true,
>>     tags: false,
>>     force: false,
>>     atomic: false,
>>     delete: false,
>>     prune: false,
>>     signed: false,
>>     ipv4: true,
>>     ipv6: false,
>>     quiet: false,
>>     'dry-run': true,
>>     'follow-tags': true,
>>     'no-verify': true,
>>     'set-upstream': false,
>>     'push-option': false,
>>     'receive-pack': false
>>   },
>>   remote: '',
>>   branch: '',
>>   cwd: '',
>>   verbose: true,
>>   debug: true,
>>   continueIfError: false
>> }
>> Spawn Options:
>>  {}
>> Command: git push --all --ipv4 --dry-run --follow-tags --no-verify
>> Everything up-to-date
OK
```
