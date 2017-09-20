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
var paceBar;

var processChildren = require('./process-children');

module.exports = function(icon, svgjs, done){

    var config = icon.config;
    var filename = path.basename(icon.filepath, '.svg').replace(/ /g, '-');
    var original = JS2SVG(svgjs).data;
    var iconDescription = {
        filename: filename,
        type: config.type,
    }

    //remove frames
    processChildren(svgjs.content, function(childValue, childKey, childParent){
        if(childValue.attrs && childValue.attrs && childValue.attrs.id && childValue.attrs.id.value.indexOf('Frame') !== -1){
            delete childParent[childKey];
        }
    });

    //remove fills/styles
    processChildren(svgjs.content, function(childValue, childKey, childParent){
        if( (childValue.elem == "path" || childValue.elem == "polygon" || childValue.elem == "circle" || childValue.elem == "rect" || childValue.elem == "g") && childParent[childKey].attrs){
            if(childParent[childKey].attrs['fill'] && childParent[childKey].attrs['fill'].value !== "none"){
                childParent[childKey].attrs = _.omit(childParent[childKey].attrs, 'fill');
            }
            if(childParent[childKey].attrs['style'] && childParent[childKey].attrs['style'].value.indexOf("fill:none;") == -1){
                childParent[childKey].attrs = _.omit(childParent[childKey].attrs, 'style');
            }
        }
    });


    var resultingFile = svgjs.clone();
    var standalone = svgjs.clone();

    //find svg
    var svgElement = null;
    processChildren(resultingFile.content, function(childValue, childKey, childParent){
        if(childValue.elem == "svg"){
            svgElement = childValue;
        }
    });
    var symbol = _.extend(_.clone(svgElement), { 
        elem: 'symbol',
        prefix: '',
        local: 'symbol',
        attrs: { 
            viewBox: svgElement.attrs.viewBox,
            id: { name: 'id', value: 'svg-icon-'+filename+config.suffix, prefix: '', local: 'id' }
        },
        content: _.clone(svgElement.content),
    });

    //remove x,y,width,height
    svgElement.attrs = _.omit(svgElement.attrs, 'x', 'y', 'width', 'height', 'viewBox', 'style', 'xml:space');
    svgElement.content = [symbol];

    fs.writeFile(path.normalize(config.dest+'/'+filename+config.suffix+'.svg'), JS2SVG(resultingFile).data, function(err) {
        if(err) {
            done(err, iconDescription);
            return;
        }

        fs.writeFile(path.normalize(config.dest+'/'+filename+config.suffix+'-source'+'.svg'), original, function(err) {

            fs.writeFile(path.normalize(config.dest+'/zip/'+filename+config.suffix+'.svg'), JS2SVG(standalone).data, function(err) {
                done(err, iconDescription);
            }); 

        }); 

    }); 

}