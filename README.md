# 智慧校园管理系统

#### 介绍
校园管理系统

---

## 开发环境启动（热更新）

```bash
cd /Users/xxxx/educontrol---智慧校园管理系统
npm run dev
```

访问 http://localhost:3000

---

## 发布部署流程

### 方式一：使用发布器（推荐）

1. **构建前端 + 打包后端**
   ```bash
   cd /Users/xxxx/educontrol---智慧校园管理系统
   ./build-deploy.sh
   ```

2. **使用发布器部署**
   - 打开发布器：`/Users/xxxx/edu-deploy/src-tauri/target/release/bundle/macos/智慧校园发布器.app`
   - 选择项目文件夹：`/Users/xxxx/Downloads/educontrol---智慧校园管理系统`
   - 点击"部署"

### 方式二：手动部署

1. **构建前端**
   ```bash
   npm run build
   ```

2. **打包后端**
   ```bash
   npx esbuild server.ts --bundle --platform=node --format=esm --outfile=working-server.js \
     --external:better-sqlite3 --external:multer --external:express --external:xlsx --external:dotenv
   ```

3. **启动服务**
   ```bash
   node working-server.js
   ```

---

## 部署脚本说明

`build-deploy.sh` 会执行：
1. `npm run build` - 构建 React 前端到 dist 目录
2. `npx esbuild` - 打包 server.ts 为 working-server.js

生成的 `working-server.js` 包含完整的后端 API，可以直接用 Node 运行。

---

## 目录结构

```
├── server.ts          # 后端源码（TypeScript）
├── working-server.js  # 后端打包文件（用于部署）
├── dist/              # 前端构建产物
├── build-deploy.sh    # 一键构建部署脚本
├── edu_control.db    # SQLite 数据库
└── uploads/          # 上传文件目录
```

---

## 注意事项

- 每次修改代码后，需要重新运行 `build-deploy.sh` 再部署
- `working-server.js` 必须与 `dist` 目录在同一目录下
- 服务默认端口：3000
