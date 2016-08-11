var git = require('./lib/repository');
var fs = require('fs');
var dir = require('dir-util')
, options = {
                filters: [ /\.git$/ ]

        }
, path = '/data/repositories'
;

var searchFmt = '--ignore-case --threads 8  -e  \'select \' --name-only';
var done = function(err, files) {                                                                                                                                             
       files.forEach(function(entry) {
         if(entry.indexOf('.wiki.git') ==  -1) {
            var repo = new git(entry);
            console.log("branch:" + specified_branch(repo)+ "**repo.path:" + repo.path);
                 
            repo.grep(specified_branch(repo), searchFmt, function(err, log) {
              if(err){
                fs.appendFile('./reports/search.error', entry + '  ' +  err + "\n", function(err){});
                return;
              } 
              fs.appendFile('./reports/seearch.report', "*** "+ entry + "***\n" + log + "\n", function(err){});
            })
           } 
      })
};
    
dir.find(path, options, done);

function specified_branch(repo){
  var branches = repo.getBranchesSync();
  if(branches.current == null) return 'master';
  if(branches.current.indexOf('master') > -1 || branches.others.indexOf('master') > -1) return 'master';
  if(branches.current.indexOf('release') > -1 || branches.others.indexOf('release') > -1) return 'release';
  return branches['current'];
}
