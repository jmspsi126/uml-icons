var webpack = require('webpack');

module.exports = function(){
    return new webpack.NormalModuleReplacementPlugin(
        /^uml-icons\//,
        function(resource){
            resource.request = 'uml-icons/icons.zip?file='+resource.request.replace('uml-icons/', '')+'.svg';
        }
    );
}