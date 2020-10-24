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
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { output } = require('./webpack.config');

/**
 * InterpolateWebpackPlugin
 *
 * @class InterpolateWebpackPlugin
 */
class InterpolateWebpackPlugin {
  constructor(options) {
    this.options = options;
  }

  formatPublicPath(publicPath, path) {
    return publicPath + path.replace('./', '');
  }

  transformPath(pathGlob, prePath) {
    return new Promise((resolve, reject) => {
      glob(pathGlob, (err, files) => {
        if (err) {
          reject(err);
        }

        // fix: windows path \ to /
        // const cwd = process.cwd().replace(/\\/g, '/');

        const path = files[0].replace(new RegExp(escapeStringRegexp(`${prePath}/`), 'g'), '');

        resolve(path);
      });
    });
  }

  validateOptions(options) {
    if (!Array.isArray(this.options)) {
      if (typeof this.options === 'object') {
        return [this.options];
      } else {
        console.error(
          '\n',
          chalk.bgRed.bold('InterpolateWebpackPlugin'),
          'options wrong and will be ignored.'
        );
        return false;
      }
    }
    return options;
  }

  apply(compiler) {
    compiler.hooks.compilation.tap('InterpolateWebpackPlugin', (compilation) => {
      HtmlWebpackPlugin.getHooks(compilation).beforeEmit.tapAsync(
        'InterpolateWebpackPlugin',
        (data, callback) => {
          const options = this.validateOptions(this.options);

          if (options) {
            (async () => {
              try {
                const { publicPath } = compilation.outputOptions;
                const len = options.length;
                console.log(compilation.outputOptions);

                for (let i = 0; i < len; i++) {
                  const item = options[i];
                  const key = new RegExp(`%${escapeStringRegexp(item.key)}%`, 'g');

                  if (!item.type || item.type === 'STRING') {
                    data.html = data.html.replace(key, item.value);
                  } else if (item.type === 'PATH') {
                    // fix: windows path \ to /
                    const prePath = process.cwd().replace(/\\/g, '/');
                    await this.transformPath(item.value, prePath)
                      .then((path) => {
                        const target = publicPath ? this.formatPublicPath(publicPath, path) : path;
                        data.html = data.html.replace(key, target);
                      })
                      .catch((err) => {
                        console.log(
                          chalk.red('something error occurred, please check error stack: ')
                        );
                        console.error(err);
                      });
                  } else if (item.type === 'OUTPUTPATH') {
                    // fix: windows path \ to /
                    const prePath = output.path.replace(/\\/g, '/');
                    await this.transformPath(item.value, prePath)
                      .then((path) => {
                        const target = publicPath ? this.formatPublicPath(publicPath, path) : path;
                        data.html = data.html.replace(key, target);
                      })
                      .catch((err) => {
                        console.log(
                          chalk.red('something error occurred, please check error stack: ')
                        );
                        console.error(err);
                      });
                  } else {
                    console.warn(
                      '\n',
                      chalk.bgYellow.bold('InterpolateWebpackPlugin'),
                      `type '${item.type}' wrong will be ignored.`
                    );
                  }
                }

                callback(null, data);
              } catch (error) {
                console.log(chalk.red('something error occurred, please check error stack: '));
                console.error(error);
              }
            })();
          } else {
            callback(null, data);
          }
        }
      );
    });
  }
}

module.exports = InterpolateWebpackPlugin;
