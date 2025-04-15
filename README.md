# 微信小程序构建和上传工具

这是一个用于自动化构建和上传微信小程序的工具。它支持多个不同版本的小程序构建和上传，并自动管理版本号。

## 功能特点

- 自动检测代码更新，只在必要时重新构建
- 自动递增版本号
- 检查主包大小，确保不超过微信小程序的限制
- 支持多个不同版本的小程序构建和上传
- 自动上传到微信小程序后台

## 安装

1. 确保已安装 Node.js (>=12.0.0)
2. 克隆此仓库
3. 安装依赖：

```bash
npm install
```

## 配置

在使用前，请确保以下配置文件存在：

1. `private.key` - 微信小程序私钥文件，用于上传代码
2. `version.json` - 版本配置文件

这些文件应放在 `expo-taro-scripts` 目录下（可通过环境变量 `SCRIPTS_DIR` 修改）。

## 使用方法

### 构建和上传特定版本

```bash
# 使用 npm 脚本
npm run build:common
npm run build:market
npm run build:club
# 等等...

# 或直接使用 node
node bau.js common
node bau.js market
node bau.js club
# 等等...
```

### 可用版本列表

- common / common_live
- market / market_live
- club / club_live
- cbd / cbd_live
- ciff / ciff_live / ciff_live_lbs
- ciff_sh / ciff_sh_live
- ybz / ybz_live
- cbd2 / cbd2_live
- scmc / scmc_live
- sxjc / sxjc_live
- cdjjz / cdjjz_live

## 工作流程

1. 检查配置文件是否存在
2. 获取目标版本
3. 检查是否需要构建（检测代码更新或构建目录不存在）
4. 如果需要，执行构建
5. 检查主包大小
6. 更新版本号
7. 上传代码到微信小程序后台

## 注意事项

- 确保您的 IP 地址已添加到微信小程序后台的白名单中
- 主包大小不能超过 2048KB
- 确保 `private.key` 文件安全，不要提交到版本控制系统

## 依赖

- miniprogram-ci: ^1.8.0
- cross-env: ^7.0.3 