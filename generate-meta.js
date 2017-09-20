var fs = require('fs');
var path = require('path');
var _ = require('underscore');
var util = require('util');

var icons = [];

var lineIconsMeta = require('./source/_Iconjar/Line-Icons.iconjar/META.json');
var solidIconsMeta = require('./source/_Iconjar/Line-Icons.iconjar/META.json');
var customIconsMeta = require('./source/custom/meta.js');
var deprecatedIconsMeta = require('./source/deprecated/meta.js');
var brandsIconsMeta = require('./source/brands/meta.js');

icons = icons.concat(customIconsMeta);
icons = icons.concat(deprecatedIconsMeta);
icons = icons.concat(brandsIconsMeta);

_.each(lineIconsMeta.items, function(item){
    icons.push({
        name: item.file.replace(/ /g, '-'),
        type:'line',
        tags: item.tags,
        category: lineIconsMeta.sets[item.parent].name.split(' ').slice(1).join(' ')
    })
});

_.each(solidIconsMeta.items, function(item){
    icons.push({
        name:item.file.replace(/ /g, '-').replace('.svg', '-s.svg'),
        type:'solid',
        tags: item.tags,
        category: lineIconsMeta.sets[item.parent].name.split(' ').slice(1).join(' ')
    })
});

fs.writeFile('./dist/icons.json', JSON.stringify(icons, null, 4));


