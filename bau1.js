#!/usr/bin/env node

const { execSync } = require('child_process');
const ci = require('miniprogram-ci');
const fs = require('fs');
const path = require('path');

// 构建目录映射表
const BUILD_DIR_MAP = {
  common: 'dist-common-build',
  common_live: 'dist-common-live-build',
  market: 'dist-market-build',
  market_live: 'dist-market-live-build',
  club: 'dist-club-build',
  club_live: 'dist-club-live-build',
  cbd: 'dist-cbd-build',
  cbd_live: 'dist-cbd-live-build',
  ciff: 'dist-ciff-build',
  ciff_live: 'dist-ciff-live-build',
  ciff_live_lbs: 'dist-ciff-live-lbs-build',
  ciff_sh: 'dist-ciff-sh-build',
  ciff_sh_live: 'dist-ciff-sh-live-build',
  ybz: 'dist-ybz-build',
  ybz_live: 'dist-ybz-live-build',
  cbd2: 'dist-cbd2-build',
  cbd2_live: 'dist-cbd2-live-build',
  scmc: 'dist-scmc-build',
  scmc_live: 'dist-scmc-live-build',
  sxjc: 'dist-sxjc-build',
  sxjc_live: 'dist-sxjc-live-build',
  cdjjz: 'dist-cdjjz-build',
  cdjjz_live: 'dist-cdjjz-live-build'
};

// 配置常量
const APP_ID = 'wxed773cf2413ef209';
const PRIVATE_KEY_PATH = './private.key';
const desc_txt = 'fix bug';

// 获取命令行参数
function getTargetFromArgs() {
  const args = process.argv.slice(2);
  if (args.length === 0) {
    console.log('Usage: node build-and-upload.js <TAG>');
    console.log('Available TAGs:', Object.keys(BUILD_DIR_MAP).join(', '));
    process.exit(1);
  }
  return args[0];
}

// 获取构建目录
function getBuildDir(targetVersionKey) {
  const buildDir = BUILD_DIR_MAP[targetVersionKey];
  if (!buildDir) {
    console.error(`未找到与目标 ${targetVersionKey} 对应的构建目录`);
    process.exit(1);
  }
  return path.resolve(__dirname, buildDir);
}

// 版本号递增逻辑
function incrementVersion(version) {
  const parts = version.split('.').map(Number);
  if (parts.length !== 3) {
    throw new Error('版本号格式不正确，应为 "主版本.次版本.修订版本"');
  }
  const [major, minor, patch] = parts;
  if (patch < 9) {
    return `${major}.${minor}.${patch + 1}`;
  } else if (minor < 9) {
    return `${major}.${minor + 1}.0`;
  } else {
    return `${major + 1}.0.0`;
  }
}

// 获取主包大小
function getMainPackageSize(projectPath) {
  if (!fs.existsSync(projectPath)) {
    throw new Error(`主包目录不存在: ${projectPath}`);
  }
  const files = fs.readdirSync(projectPath);
  let totalSize = 0;
  for (const file of files) {
    const filePath = path.join(projectPath, file);
    const stats = fs.statSync(filePath);
    totalSize += stats.size;
  }
  return totalSize / 1024;
}

// 检查git是否有更新或本地有未提交的更改（仅检查src目录）
function checkGitUpdates() {
  try {
    // 获取当前分支的远程更新
    execSync('git fetch', { stdio: 'inherit' });
    
    // 需要忽略的文件列表
    const ignoreFiles = [
      '.gitignore',
      '.gitinfosparse-checkout',
      'bau.js',
      'build-and-upload.js',
      'version.json'
    ];
    
    // 1. 检查远程是否有更新
    // 获取本地和远程的差异
    const localCommit = execSync('git rev-parse HEAD').toString().trim();
    const remoteCommit = execSync('git rev-parse @{u}').toString().trim();
    
    // 如果本地和远程commit不同，直接返回true（需要重新构建）
    if (localCommit !== remoteCommit) {
      console.log('检测到远程仓库有更新，需要重新构建...');
      return true;
    }
    
    // 2. 检查本地src目录是否有更改
    // 检查本地有未提交的更改
    const localChanges = execSync('git ls-files -m -o --exclude-standard').toString().trim();
    
    if (localChanges) {
      // 过滤文件列表，只保留src目录下的文件，并排除忽略列表中的文件
      const changedFiles = localChanges.split('\n').filter(file => {
        // 文件不在忽略列表中，且文件路径以 src/ 开头
        return !ignoreFiles.includes(file) && file.startsWith('src/');
      });
      
      if (changedFiles.length > 0) {
        console.log('检测到src目录下有未提交的更改，需要重新构建...');
        console.log('变更的文件:');
        console.log(changedFiles.join('\n'));
        return true;
      } else {
        console.log('检测到的更改不在src目录或在忽略列表中，跳过构建...');
        return false;
      }
    }
    
    // 没有检测到需要重新构建的情况
    console.log('没有检测到本地或远程的相关更新...');
    return false;
  } catch (error) {
    console.error('检查git更新失败:', error);
    return true; // 如果检查失败，为了安全起见返回true
  }
}

async function main() {
  try {
    // 1. 获取目标版本
    const targetVersionKey = getTargetFromArgs();
    console.log(`开始构建目标: ${targetVersionKey}`);

    // 2. 获取构建目录
    const buildDir = getBuildDir(targetVersionKey);
    const projectPath = path.resolve(__dirname, buildDir);

    // 3. 检查是否需要构建
    const hasGitUpdates = checkGitUpdates();
    const buildDirExists = fs.existsSync(projectPath);

    if (hasGitUpdates || !buildDirExists) {
      // 需要构建的情况
      console.log('检测到代码更新或构建目录不存在，开始构建...');
      process.env.TAG = targetVersionKey;
      execSync(`git pull && taro build --type weapp --config build-config.json`, { 
        stdio: 'inherit', 
        env: process.env 
      });
    } else {
      console.log('没有检测到代码更新且构建目录已存在，跳过构建步骤...');
    }

    // 4. 检查主包大小
    const mainPackageSize = getMainPackageSize(projectPath);
    console.log(`主包大小: ${mainPackageSize.toFixed(2)} KB`);

    if (mainPackageSize > 2048) {
      console.error('主包大小超出限制（2048KB），请优化后再上传');
      process.exit(1);
    }

    // 5. 更新版本号
    const versionJsonPath = path.join(__dirname, 'version.json');
    let versionJson = JSON.parse(fs.readFileSync(versionJsonPath, 'utf8'));
    let currentVersion = versionJson.versions?.[targetVersionKey];
    
    if (!currentVersion) {
      console.error(`未找到目标版本键 "${targetVersionKey}"`);
      process.exit(1);
    }

    const versionPrefix = currentVersion.split(/(\d+\.\d+\.\d+)/)[0];
    const versionNumber = currentVersion.split(/(\d+\.\d+\.\d+)/)[1];
    const newVersionNumber = incrementVersion(versionNumber);
    const newVersion = versionPrefix + newVersionNumber;

    console.log(`当前版本: ${currentVersion}`);
    console.log(`新版本: ${newVersion}`);

    // 6. 更新 version.json
    versionJson.versions[targetVersionKey] = newVersion;
    fs.writeFileSync(versionJsonPath, JSON.stringify(versionJson, null, 2));

    // 7. 上传代码
    console.log('开始上传代码...');
    const project = new ci.Project({
      appid: APP_ID,
      type: 'miniProgram',
      projectPath: projectPath,
      privateKeyPath: PRIVATE_KEY_PATH,
      ignores: ['node_modules/**/*'],
      setting: {
        es6: true,
        minify: true,
      },
      paths: {
        '/components': path.join(projectPath, 'components'),
        '/comp': path.join(projectPath, 'components/comp')
      }
    });

    await ci.upload({
      project,
      version: newVersion,
      desc: desc_txt,
      onProgressUpdate: (progress) => {
        console.log(`上传进度: ${progress}%`);
      },
      robot: 30,
      threads: 4,
    });

    console.log('构建和上传完成！');
  } catch (error) {
    if (error.code === 20003 && error.errMsg && error.errMsg.includes('invalid ip')) {
      console.error('IP 地址未授权，请将您的 IP 地址添加到微信小程序后台的白名单中');
    } else {
      console.error('执行失败:', error);
    }
    process.exit(1);
  }
}

main(); 