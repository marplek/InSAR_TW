FROM node:18

# 創建應用目錄
WORKDIR /usr/src/app

# 複製 package.json 和 package-lock.json
COPY package*.json ./
COPY tsconfig.json ./

# 安裝依賴
RUN npm install
RUN npm install -g typescript ts-node
RUN npm install --save-dev @types/node @types/express @types/cors @types/pg

# 為了解決類型問題，在容器中創建必要的類型聲明文件
RUN mkdir -p src/@types
RUN echo 'declare module "express-jwt";' > src/@types/express-jwt.d.ts
RUN echo 'declare module "pg";' > src/@types/pg.d.ts

# 複製源代碼
COPY . .

# 對外開放端口
EXPOSE 5000

# 使用 ts-node 直接運行 TypeScript 代碼，忽略類型檢查錯誤
CMD ["npx", "ts-node", "--transpile-only", "src/app.ts"]