# 前端构建阶段
FROM node:14 as frontend-build

WORKDIR /app/frontend

COPY frontend/package*.json ./

RUN npm install

COPY frontend .

RUN npm run build

# 后端构建阶段
FROM node:14 as backend-build

WORKDIR /app/backend

COPY backend/package*.json ./

RUN npm install

COPY backend .

# 最终阶段
FROM nginx:alpine

# 复制前端构建文件
COPY --from=frontend-build /app/frontend/build /usr/share/nginx/html
COPY --from=frontend-build /app/frontend/public/manifest.json /usr/share/nginx/html/manifest.json

# 复制后端文件
COPY --from=backend-build /app/backend /app/backend

# 安装 Node.js
RUN apk add --update nodejs npm

# 设置工作目录
WORKDIR /app/backend

# 暴露端口
EXPOSE 80 5000

# 启动命令
CMD nginx -g 'daemon off;' & node src/server.js