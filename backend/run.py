import os
from app import create_app

# 获取配置环境
config_name = os.environ.get('FLASK_ENV', 'default')
app = create_app(config_name)

if __name__ == '__main__':
    print("=" * 50)
    print("Flask 应用启动中...")
    print(f"环境: {config_name}")
    print(f"Conda 环境: itwangyang")
    print("前端地址: http://localhost:3000")
    print("后端地址: http://localhost:5001")  # 改为 5001
    print("API 健康检查: http://localhost:5001/api/health")  # 改为 5001
    print("=" * 50)

    app.run(debug=True, host='0.0.0.0', port=5001)  # 改为 5001