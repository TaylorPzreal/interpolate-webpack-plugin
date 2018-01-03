/**
 * Func: interpolate custom variables into 'index.html'
 * ext: provide path reg could interpolate path string into 'intex.html'
 * Example: new InterpolateWebpackPlugin({
 *  key: 'REPLACEME',
 *  value: 'ABSOLUTELY',
 *  type: 'STRING'
 * })
 *
 * options could be an object or array like:
 * [{
 *  key: 'VARIABLE_NAME',
 *  value: 'REPLACE_TEXT',
 *  type: 'STRING' // this value could only be 'STRING' OR 'PATH' and default 'STRING'
 * }]
 *
 * when 'type' is 'PATH', the 'value' coluld be an absolute string path, like: root('dll/*.js'), but only match first file path
 */

const glob = require('glob');
const chalk = require('chalk');
const escapeStringRegexp = require('escape-string-regexp');

/**
 * InterpolateWebpackPlugin
 *
 * @class InterpolateWebpackPlugin
 */
class InterpolateWebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  transformPath(pathGlob) {
    return new Promise((resolve, reject) => {
      glob(pathGlob, (err, files) => {
        if (err) {
          reject(err);
        }

        // fix: windows path \ to /
        const cwd = process.cwd().replace(/\\/g, '/');
  
        const path = files[0].replace(new RegExp(escapeStringRegexp(`${cwd}/`), 'g'), '');
  
        resolve(path);
      });
    });
  }

  validateOptions(options) {
    if (!Array.isArray(this.options)) {
      if (typeof this.options === 'object') {
        return [this.options];
      } else {
        console.error('\n', chalk.bgRed.bold('InterpolateWebpackPlugin'), 'options wrong and will be ignored.');
        return false;
      }
    }
    return options;
  }

  apply(compiler) {
    compiler.plugin('compilation', compilation => {
      compilation.plugin('html-webpack-plugin-before-html-processing', (data, callback) => {
        const options = this.validateOptions(this.options);
        if (options) {
          (async () => {
            const publicPath = data.assets.publicPath;
            const len = options.length;
  
            for (let i = 0; i < len; i++) {
              const item = options[i];
              const key = new RegExp(`%${escapeStringRegexp(item.key)}%`, 'g');
  
              if (!item.type || item.type === 'STRING') {
                data.html = data.html.replace(key, item.value);
              } else if (item.type === 'PATH') {
                await this.transformPath(item.value).then(path => {
                  data.html = data.html.replace(key, publicPath + path);
                });
              } else {
                console.warn('\n', chalk.bgYellow.bold('InterpolateWebpackPlugin'), `type '${item.type}' wrong will be ignored.`);
              }
            }
  
            callback(null, data);
          })();
        } else {
          callback(null, data);
        }
      });
    });
  }
}

module.exports = InterpolateWebpackPlugin;
