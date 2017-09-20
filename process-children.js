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

function processChildren(children, callback){
    _.each(children, function(value, key, obj){
        if(callback && typeof value !== 'undefined'){
            callback(value, key, obj);
        }
        if(typeof value !== 'undefined' && value.content){
            processChildren(value.content, callback);
        }
    });
}

module.exports = processChildren;