import os
from datetime import timedelta

class Config:
    SECRET_KEY = os.environ.get('SECRET_KEY') or 'your-secret-key-here'
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'mysql+pymysql://root:ITwangyang%40520@localhost/myproject_db'
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY') or 'jwt-secret-key'
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    JWT_REFRESH_TOKEN_EXPIRES = timedelta(days=30)

class DevelopmentConfig(Config):
    DEBUG = True
    # 开发环境可以使用SQLite作为备选
    SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL') or \
        'mysql+pymysql://root:ITwangyang%40520@localhost/myproject_db'

class ProductionConfig(Config):
    DEBUG = False

# 添加SQLite备选配置（如果MySQL连接失败）
class SQLiteConfig(Config):
    SQLALCHEMY_DATABASE_URI = 'sqlite:///myproject.db'
    DEBUG = True

config = {
    'development': DevelopmentConfig,
    'production': ProductionConfig,
    'sqlite': SQLiteConfig,
    'default': DevelopmentConfig
}