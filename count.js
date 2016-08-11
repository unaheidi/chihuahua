var XLSX = require("xlsx");
var git = require('./lib/repository');  
var fs = require('fs');

var workbook = XLSX.readFile('basic.xlsx');
var sheetNames = workbook.SheetNames; 
var worksheet = workbook.Sheets[sheetNames[0]];
var data =  XLSX.utils.sheet_to_json(worksheet);

var _ = require("underscore");
var web_filtered = _.where(data, {product_line_name: "XX产品线", app_category:"Application", source_type: "GTS"});
var service_filtered = _.where(data, {product_line_name: "XX产品线", app_category:"Service", source_type: "GTS"});
console.log('所有应用个数：' + data.length);
console.log('*********************************************');
console.log('某BU web个数：' + web_filtered.length);
console.log('某BU service个数：' + service_filtered.length);

var web_lines = [];
var service_lines = [];

web_lines = count_lines(web_filtered);
service_lines = count_lines(service_filtered);

var web_lines_count = 0;
var service_lines_count = 0;

_.each(web_lines,function(row){
  web_lines_count = web_lines_count + row.lines;
});

_.each(service_lines,function(row){
  service_lines_count = service_lines_count + row.lines;
});

console.log(web_lines);
console.log(service_lines);

console.log('所有web行数：' + web_lines_count);
console.log('所有service行数' + service_lines_count);

function count_lines(filtered_collection){
  var result_lines = [];
  for(var i = 0; i < filtered_collection.length; i++){
    var app = filtered_collection[i];
    var path = "/gerrit/repo/path" + app["name"];
    var myRepo = git(path);
    if (isDirSync(path+'/.git')) {
      process.chdir(path);
      myRepo.pull(app["code_url"],'',{ussername: 'xxx'},function(err){ if(err) {console.log(err)} });
    }else{
      git.clone(path, app["code_url"], {username: 'xxx'}, function(err){ if(err) {console.log(err)} });
    }
    
    var repo_line_count = myRepo.linesSync(app['main_dir']);
    result_lines.push({"name": app["name"], "lines": repo_line_count});
  }
  return result_lines;
}


function isDirSync(aPath) {
  try {
    return fs.statSync(aPath).isDirectory();
  } catch (e) {
    if (e.code === 'ENOENT') {
      return false;
    } else {
      throw e;
    }
  }
}