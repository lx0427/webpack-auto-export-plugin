// 仅用于node脚本执行使用
const path = require("path");
const fs = require("fs");

/**
 * 读取文件夹所有文件，排除指定文件
 * @param {pattern} except 排除文件
 * @param {pattern} include 包含文件
 * @returns function
 */
const getAllDirFiles = (except = null, include = null) =>
    function dealDir(dir, fileList = []) {
        let files = fs.readdirSync(dir);
        files.forEach((v) => {
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

exports.getAllDirFiles = getAllDirFiles;
