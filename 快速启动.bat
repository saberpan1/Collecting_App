@echo off
chcp 65001 >nul
echo ========================================
echo   古钱币收藏小程序 - 快速启动指南
echo ========================================
echo.
echo 项目位置：%CD%
echo.
echo 启动步骤:
echo.
echo 1. 打开微信开发者工具
echo.
echo 2. 导入项目
echo    - 点击"+"或"导入项目"
echo    - 选择目录：%CD%
echo    - 填写 AppID(或使用测试号)
echo.
echo 3. 修改配置
echo    - 打开 project.config.json
echo    - 将 appid 修改为你的小程序 AppID
echo.
echo 4. 添加图标 (可选)
echo    - 在 images 目录下添加图标文件
echo    - 详见 images/快速创建图标.md
echo.
echo 5. 点击"编译"运行
echo.
echo ========================================
echo 文档说明:
echo - README.md          : 项目介绍
echo - 使用指南.md        : 详细教程
echo - 项目总结.md        : 技术总结
echo ========================================
echo.
echo 按任意键打开项目目录...
pause >nul
explorer .
