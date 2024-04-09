## 项目概述

该项目是一个使用 React、TypeScript 和 Vite 构建的旅游日记平台审核应用程序。

## 技术栈

该项目使用的技术栈包括：

- React: 用于构建用户界面的 JavaScript 库。
- TypeScript: 一种构建在 JavaScript 基础上的编程语言。
- Vite: 下一代前端工具，用于快速构建现代化的 Web 应用程序。

## 项目部署步骤

本文档提供了将您的 React TypeScript Vite 项目部署到生产环境的步骤。

### 步骤一：克隆仓库

```bash
git clone git@github.com:dxdfy/tour_manage.git

### 步骤二：安装依赖

```bash
npm install

### 步骤三：本地开发

```bash
npm run dev

## 文件结构

项目的文件结构如下：

- `src/`: 源代码文件夹。
  - `assets/`: 存放项目所需的静态资源文件夹。
  - `pages/`: 存放页面组件的文件夹。
  - `utils/`: 存放工具函数的文件夹。
  - `app.css`: 应用程序的全局样式表文件。
  - `app.tsx`: 应用程序的主入口文件，通常包含应用程序的根组件。
  - `index.css`: HTML 入口文件的样式表文件。
  - `main.tsx`: 主入口文件，用于渲染应用程序并将其挂载到 DOM 上。
  - `vite-env.d.ts`: Vite 环境声明文件，用于配置 TypeScript 环境。
- `.eslintrc.cjs`: 用于对项目进行代码检查的 ESLint 配置文件。
- `.gitignore`: 指定了 Git 应该忽略的未跟踪文件。
- `tsconfig.json`: TypeScript 编译器选项和项目配置。
- `index.html`: 项目的 HTML 模板，包括 Vite 配置。

## 项目路由配置

该项目使用了 React Router 进行页面导航，并实现了简单的权限控制。

### 主要组件

- `App.tsx`: 应用程序的主入口文件，包含了页面布局和路由配置。
- `main.tsx`: 主要的页面布局组件，负责渲染应用程序的主要页面内容。

### 路由配置

- `main.tsx`: 主入口文件，定义了应用程序的主要页面布局，并通过 React Router 配置了页面路由。
  - `/case`: 案例管理页面组件。
  - `/user`: 用户管理页面组件。

### 权限控制

- `App.tsx`: 在 `PrivateRoute` 组件中实现了简单的权限控制逻辑。
  - 检查 sessionStorage 中是否存在 token，如果不存在则重定向到登录页面。
  - 如果存在 token，则渲染传入的元素（即需要权限的页面组件）。

### 脚本

- `dev`: 使用 Vite 启动开发服务器。
- `build`: 使用 TypeScript 编译器和 Vite 构建项目。
- `lint`: 使用 ESLint 进行项目的代码检查。
- `preview`: 启动类似生产环境的服务器以预览构建后的项目。

### 依赖项

- antd: 用于 React 的 UI 组件库。
- axios: 基于 Promise 的 HTTP 客户端，用于发起请求。
- nprogress: 用于 HTTP 请求的进度条。
- react: 构建用户界面的 JavaScript 库。
- react-dom: 用于操作 DOM 的 React 包。
- react-highlight-words: 用于在文本中高亮显示关键词的 React 组件。
- react-lazyload: 用于延迟加载图像或组件的 React 组件。
- react-player: 用于播放各种媒体类型的 React 组件。
- react-router-dom: React 路由库，用于页面导航。

