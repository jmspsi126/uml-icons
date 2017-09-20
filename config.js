module.exports = {
    sources:[
        {
            files:'./source/custom/**.svg',
            type:'line',
            prefix:'',
            suffix:'',
            processor: require('./process-custom.js'),
        },
        {
            files:'./source/brands/**.svg',
            type:'line',
            prefix:'',
            suffix:'',
            processor: require('./process-custom.js'),
        },
        {
            files:'./source/deprecated/**.svg',
            type:'line',
            prefix:'',
            suffix:'',
            processor: require('./process-custom.js'),
        },
        {
            files:'./source/_Iconjar/Line-Icons.iconjar/icons/**.svg',
            type:'line',
            prefix:'',
            suffix:'',
            processor: require('./process-nova.js'),
        },
        {
            files:'./source/_Iconjar/Solid-Icons.iconjar/icons/**.svg',
            prefix:'',
            suffix:'-s',
            processor: require('./process-nova.js'),
        },
    ]
}