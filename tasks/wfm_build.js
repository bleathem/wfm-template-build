'use strict';

var build = require('../lib/build.js');
var watch = require('node-watch');
const taskName = 'wfmTemplate';

module.exports = function(grunt) {

  grunt.config.merge({
    wfmTemplate: {
      build: {},
      watch: {}
    }
  });

  grunt.registerMultiTask('wfmTemplate', 'A build tool for WFM modules', function() {
    const taskConfig = grunt.config.get(this.name);
    const moduleName = getAndCheckModuleName(this, grunt, taskConfig);
    const outputDir = getAndCheckOutputDir(this, grunt, taskConfig);
    const templateDir = taskConfig.templateDir || 'lib/angular/template';
    this.async();
    if (this.target === 'build') {
      build(moduleName, outputDir, templateDir);
    } else if (this.target === 'watch') {
      build(moduleName, outputDir, templateDir);
      watch('./' + templateDir, () => build(moduleName, outputDir, templateDir));
    } else {
      usage(grunt, this.name);
    }
  });
};

function getAndCheckModuleName(task, grunt, taskConfig) {
  var moduleName = grunt.option('module') || task.data.module || taskConfig.module;
  grunt.log.debug("--module=" + moduleName);
  if (!moduleName) {
    usage(grunt, task.name);
  }
  return moduleName;
};

function getAndCheckOutputDir(task, grunt, taskConfig) {
  var outputDir = grunt.option('outputDir') || task.data.outputDir || taskConfig.outputDir;
  grunt.log.debug("--outputDir=" + outputDir);
  if (!outputDir) {
    outputDir = "dist";
  }
  return outputDir;
};

function usage(grunt, taskName) {
  grunt.fail.fatal('Usage: ' + taskName + ':[build | watch] --module=<module name> \nOptions:\n  --module=<module name> If module name is provided, template will be packaged under this module.\n\n');
}
