#!/bin/bash

echo "🚀 启动全栈项目"
echo "=================="

# 检查MySQL服务
echo "1️⃣ 检查MySQL服务..."
if brew services list | grep mysql | grep started > /dev/null; then
    echo "✅ MySQL服务已启动"
else
    echo "⚠️  启动MySQL服务..."
    brew services start mysql
fi

# 创建数据库和表
echo "2️⃣ 创建数据库和表..."
if mysql -u root -p'ITwangyang@520' -e "USE myproject_db;" 2>/dev/null; then
    echo "✅ 数据库已存在"
else
    echo "📝 执行数据库创建脚本..."
    mysql -u root -p'ITwangyang@520' < sql/create_database_and_tables.sql
fi

# 激活conda环境
echo "3️⃣ 激活conda环境..."
conda activate itwangyang

# 启动后端
echo "4️⃣ 启动Flask后端..."
cd backend
python run.py