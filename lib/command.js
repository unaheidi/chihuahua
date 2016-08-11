'use strict';

var childproc = require('child_process');
var exec = childproc.exec;
var execSync = childproc.execSync;


var GittyCommand = require('gitty/lib/command');

var Command = function(repo, operation, flags, options) {
  this.flags = flags || [];
  this.options = options || '';
  var largeOperations = ['log', 'ls-files', 'grep', 'lines'];

  if (typeof repo === 'string') {
    this.repo = { path: repo, gitpath: '' };
  } else {
    this.repo = repo || { path: '/', gitpath: '' };
  }
  this.command = (this.repo.gitpath ? this.repo.gitpath + ' ' : 'git ') +
    operation + ' ' + flags.join(' ') + ' ' + this.options;
  // The log on long lived active repos will require more stdout buffer.
  // The default (200K) seems sufficient for all other operations.
  this.execBuffer = 1024 * 200;
  if (largeOperations.indexOf(operation) > -1) {
    this.execBuffer = 1024 * 5000;
  }
};

Command.prototype = new GittyCommand('','');

Command.prototype.countLinesSync = function(callback){
  process.chdir(this.repo.path);
  var command =  'find .' + this.options + ' -path \'.git\' -prune -o' + ' -iregex \'.*\\(\\.js\\|\\.cs\\)$\' ' +
                 ' -type f -print0 | xargs -0  wc -l | awk \'END{print}\' | awk \'{print $1}\' ';
  console.log(command);
  var result = execSync(command, this._getExecOptions()).toString().trim()|0;
  console.log("<<<<<result:" + result);
  return result;
}

module.exports = Command;
