# interpolate-webpack-plugin

> [Extend react-dev-utils/InterpolateHtmlPlugin](https://github.com/facebookincubator/create-react-app/blob/master/packages/react-dev-utils/InterpolateHtmlPlugin.js)

It works in tandem with [HtmlWebpackPlugin](https://github.com/ampedandwired/html-webpack-plugin#events).

## Usage

### 1. Installation

```bash
yarn add -D interpolate-webpack-plugin
```

### 2. index.html

```html
<!-- Write any variables use %VARIABLE% -->

<!-- For example -->
<script src="%INJECT_DLL%"></script>
```

### 3. Config webpack.config.js

```js
const InterpolateWebpackPlugin = require('interpolate-webpack-plugin');

plugins: [
  new InterpolateWebpackPlugin([{
    key: 'INJECT_DLL',
    value: 'ABSOLUTELY',
    type: 'STRING' // type can only be 'STRING' or 'PATH', default is 'STRING'. When type is 'PATH', the 'value' you could input a glob string,like process.cwd() + 'dll/*.js',but it could only resolve matched first file name.
  }])
]
```

If you input wrong options or wrong type, will got a tip:

#### Options wrong

![Options wrong](./images/options_wrong.png)

#### Type wrong

![Type wrong](./images/type_wrong.png)

## License

MIT License

Copyright (c) 2017 TaylorPzreal

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
