from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config import config
import sys

# 创建扩展实例
db = SQLAlchemy()
jwt = JWTManager()


def create_app(config_name='default'):
  """应用工厂函数"""
  app = Flask(__name__)

  # 加载配置
  app.config.from_object(config[config_name])

  # 初始化扩展
  db.init_app(app)
  jwt.init_app(app)
  CORS(app, origins=['http://localhost:3000'])

  # 注册蓝图
  from app.routes import api_bp, auth_bp
  app.register_blueprint(api_bp, url_prefix='/api')
  app.register_blueprint(auth_bp, url_prefix='/auth')

  # 美观的根路由页面
  @app.route('/')
  def index():
    return render_template('index.html')

  # API信息路由（返回JSON）
  @app.route('/api-info')
  def api_info():
    return {
      "message": "API服务运行正常",
      "status": "success",
      "endpoints": {
        "health": "/api/health",
        "register": "/auth/register",
        "login": "/auth/login",
        "articles": "/api/articles"
      }
    }

  # 数据库初始化...
  try:
    with app.app_context():
      db.create_all()
      print("✅ 数据库连接成功，表已创建或已存在")
  except Exception as e:
    print(f"❌ 数据库连接失败: {e}")
    print("💡 请确保：")
    print("   1. MySQL服务已启动")
    print("   2. 数据库myproject_db已创建")
    print("   3. 用户名密码正确")
    print("   4. 或者使用SQLite备选方案：FLASK_CONFIG=sqlite python run.py")

  return app