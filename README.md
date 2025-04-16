# 微信小程序上传工具

这是一个用于自动化构建和上传微信小程序的工具。

## 快速开始

1. 双击 `mp-upload.bat` 脚本查看使用说明
2. 或者在命令行中运行：
   ```
   mp-upload.bat <TARGET>
   ```
   例如：`mp-upload.bat common`

### 可用目标

- common - 通用版
- common_live - 通用直播版
- market - 市场版
- market_live - 市场直播版
- club - 俱乐部版
- club_live - 俱乐部直播版
- cbd - CBD版
- cbd_live - CBD直播版
- ciff - CIFF版
- ciff_live - CIFF直播版
- ciff_live_lbs - CIFF直播LBS版
- ciff_sh - CIFF上海版
- ciff_sh_live - CIFF上海直播版
- ybz - 医博会版
- ybz_live - 医博会直播版
- cbd2 - CBD2版
- cbd2_live - CBD2直播版
- scmc - 中麻版
- scmc_live - 中麻直播版
- sxjc - 四新版
- sxjc_live - 四新直播版
- cdjjz - 成都建材展版
- cdjjz_live - 成都建材展直播版

## 功能特点

- 自动检测代码更新，只在必要时重新构建
- 自动递增版本号
- 检查主包大小，确保不超过微信小程序的限制
- 支持多个不同版本的小程序构建和上传
- 自动上传到微信小程序后台

## 注意事项

- 确保您的 IP 地址已添加到微信小程序后台的白名单中
- 主包大小不能超过 2048KB
- 确保 `private.key` 文件在脚本目录中

## 安装

### 全局安装

```bash
# 克隆仓库
git clone <仓库地址>
cd <仓库目录>

# 全局安装
npm run install-global
```

安装后，可以在任何目录使用 `mp-upload` 命令。

### 配置

使用前，请确保将以下文件放在项目根目录：

1. `private.key` - 微信小程序上传密钥
2. `version.json` - 版本配置文件

## 环境变量

可以通过环境变量自定义工具行为：

- `PROJECT_DIR` - 指定项目目录（默认为当前工作目录）

## 依赖

- miniprogram-ci: ^1.8.0
- cross-env: ^7.0.3 