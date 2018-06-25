// RemoveSrcJsPlugin.js

function RemoveSrcJsPlugin(test) {
  this.test = test;
}

RemoveSrcJsPlugin.prototype.apply = function(compiler) {
  const test = this.test;
  compiler.plugin("compilation", function(compilation) {
    // Hook into html-webpack-plugin event
    compilation.plugin('html-webpack-plugin-before-html-processing', function(pluginData, cb) {
      pluginData.html = pluginData.html.replace(test, '');
      cb();
    });
  });
};

module.exports = RemoveSrcJsPlugin;
