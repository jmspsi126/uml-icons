var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var util = require('util');
var SVGO = require('svgo');
var svgo = new SVGO();
var SVG2JS = require('svgo/lib/svgo/svg2js');
var JS2SVG = require('svgo/lib/svgo/js2svg');
var glob = require('glob');
var pace = require('pace');
var Zip = require("adm-zip");
var paceBar;

var processChildren = require('./process-children');
var processNova = require('./process-nova');

var jsonOutput = [];
var config = require('./config.js');
var iconQeue = [];
_.each(config.sources, function(source){
    source.dest = path.normalize(process.cwd()+"/dist");
    var matches = glob.sync(source.files);
    _.each(matches, function(filepath){
        iconQeue.push({
            config: source,
            filepath: filepath,
            processor: source.processor,
        });
    })
})

processAll(iconQeue);

function processAll(qeue){
    paceBar = pace(qeue.length);
    function next(){
        if(qeue.length){
            processFile(qeue.pop(), next);
        }else{
            var zip = new Zip();
            var filesToZip = glob.sync(path.normalize(process.cwd()+"/dist/zip/*.svg"));
            console.log("Writing zip...")
            _.each(filesToZip, function(filepath){
                zip.addLocalFile(filepath);
            })
            zip.writeZip(path.normalize(process.cwd()+"/icons.zip"));
        }
    }
    next();
}

function processFile(icon, next){
    fs.readFile(icon.filepath, 'utf8', function(err, filestr){

        //remove style tags
        //filestr = filestr.replace(/(<style\b[^>]*>)[^<>]*(<\/style>)/ig, '');

        //remove comments
        filestr = filestr.replace(/<!--[\s\S]*?-->/g, '');

        //remove class attributes
        filestr = filestr.replace(/class="[^"]*"/, '');

        //remove style attributes
        filestr = filestr.replace(/style="[^"]*"/, '');

        //remove id attributes
        filestr = filestr.replace(/id="[^"]*"/g, '');
        

        SVG2JS(filestr, function(svgjs) {
            var callback = function(err, iconDescriptor){
                if(err) {
                    return console.log(err);
                }
                paceBar.op();
                next();
            }    
            icon.processor(icon, svgjs, callback)
        });
    });

}