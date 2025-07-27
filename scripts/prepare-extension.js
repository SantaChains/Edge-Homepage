const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// 构建目录
const buildDir = path.join(__dirname, '../build');
// 扩展目录
const extensionDir = path.join(__dirname, '../extension');

// 创建扩展目录
if (!fs.existsSync(extensionDir)) {
  fs.mkdirSync(extensionDir);
}

// 复制构建文件到扩展目录
console.log('正在复制构建文件到扩展目录...');
execSync(`xcopy "${buildDir}" "${extensionDir}" /E /I /Y`);

// 处理图标
console.log('正在处理图标...');
const iconSizes = [16, 32, 48, 128, 192];
const iconsDir = path.join(extensionDir, 'icons');

if (!fs.existsSync(iconsDir)) {
  fs.mkdirSync(iconsDir);
}

// 复制SVG图标
fs.copyFileSync(
  path.join(__dirname, '../public/icons/icon.svg'),
  path.join(iconsDir, 'icon.svg')
);

console.log('扩展准备完成！');
console.log(`扩展文件位于: ${extensionDir}`);
console.log('你可以通过Chrome扩展管理页面加载此目录来测试扩展。');