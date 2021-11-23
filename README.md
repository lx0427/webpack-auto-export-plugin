## Install

```bash
npm i webpack-auto-export-plugin -D
```

## Usage

```js
const AutoExport = require("webpack-auto-export-plugin");
module.exports = {
    configureWebpack: (config) => {
        config.plugins.push(new AutoExport({ dir: ["src/utils", "src/api"] }));
    },
};
```

## API

### options

Type: `object`

#### dir

Type: `array`

需要监听处理的文件夹数组，不可传入嵌套文件夹
