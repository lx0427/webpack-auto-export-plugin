// 仅用于node脚本执行使用
const fs = require('fs');
const path = require('path');

/**
 * 读取文件夹所有文件，排除指定文件
 * @param {pattern} except 排除文件
 * @param {pattern} include 包含文件
 * @returns function
 */
const getAllDirFiles = (except = null, include = null) =>
    function dealDir(dir, fileList = []) {
        let files = fs.readdirSync(dir);
        files.forEach(v => {
            let filePath = path.join(dir, v);
            const stat = fs.statSync(filePath);
            if (stat.isDirectory()) {
                dealDir(filePath, fileList);
            } else if ((!except || (except && !except.test(v))) && (!include || (include && include.test(v)))) {
                fileList.push(path.join(dir, v));
            }
        });
        return fileList;
    };

const writeAutoExport = dirPath => {
    let list = getAllDirFiles(null, /.js$/)(dirPath);
    let temp = [];
    let c = '';
    list.forEach((v, i) => {
        const content = fs.readFileSync(v).toString();
        const matchList = content.match(/export (const|function) (\w+)?/g);

        if (matchList) {
            let l = matchList.map(v => v.replace(/export (const|function) /, ''));
            v = v.replace(/\//g, '\\');
            c += `export { ${l.join(', ')} } from '.${v
                .replace(dirPath.replace(/\//g, '\\'), '')
                .replace(/\\/g, '/')}';\r\n`;
            temp = temp.concat(l);
        }
    });
    fs.writeFileSync(path.join(dirPath, './index.js'), c);
};
exports.getAllDirFiles = getAllDirFiles;
exports.writeAutoExport = writeAutoExport;
