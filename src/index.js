const chokidar = require('chokidar');
const { writeAutoExport } = require('./tools');
class AutoExport {
    constructor(options) {
        // 插件配置
        this.options = {
            dir: options.dir || ['src']
        };
        this.excludeFiles = options.dir.map(p => p + '/index.js');
        this.watcher = null;
        this.isWatching = false;
        this.compileHasError = false;
        this.writeFileSync = this.writeFileSync.bind(this);
    }

    /**
     * 自动export当前目录中的方法及变量 （export function | export const）
     * @param {*} p 目录绝对路径
     */
    writeFileSync(p) {
        p = p.replace(/\\/g, '/');
        if (!this.excludeFiles.includes(p)) {
            let dirPath = this.options.dir.find(v => p.indexOf(v) > -1);
            writeAutoExport(dirPath);
        }
    }

    init(stats) {
        this.compileHasError = stats.hasErrors();

        if (this.isWatching && !this.watcher && !this.compileHasError) {
            this.watcher = chokidar.watch(this.options.dir, {
                usePolling: true
            });
            this.watcher
                .on('add', this.writeFileSync)
                .on('change', this.writeFileSync)
                .on('unlink', this.writeFileSync);
        }
    }

    watchClose() {
        if (this.watcher) {
            this.watcher.close();
            this.watcher = null;
        }
        this.isWatching = false;
    }

    apply(compiler) {
        const init = this.init.bind(this);
        // 事件名称
        compiler.hooks.watchRun.tap('AutoExport', compiler => {
            this.isWatching = true;
        });
        compiler.hooks.done.tap('AutoExport', init);
        compiler.hooks.watchClose.tap('AutoExport', () => {
            this.watchClose();
        });
    }
}

module.exports = AutoExport;
