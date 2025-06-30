from flask import Blueprint, request, jsonify
from flask_jwt_extended import create_access_token, create_refresh_token, jwt_required, get_jwt_identity
from app import db
from app.models.user import User

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    """用户注册"""
    try:
        data = request.get_json()
        
        # 验证必填字段
        if not data or not all(k in data for k in ('username', 'email', 'password')):
            return jsonify({'error': '用户名、邮箱和密码是必填项'}), 400
        
        username = data['username'].strip()
        email = data['email'].strip().lower()
        password = data['password']
        
        # 验证用户名和邮箱长度
        if len(username) < 3 or len(username) > 50:
            return jsonify({'error': '用户名长度必须在3-50个字符之间'}), 400
        
        if len(password) < 6:
            return jsonify({'error': '密码长度至少6位'}), 400
        
        # 检查用户是否已存在
        if User.query.filter_by(username=username).first():
            return jsonify({'error': '用户名已存在'}), 409
        
        if User.query.filter_by(email=email).first():
            return jsonify({'error': '邮箱已存在'}), 409
        
        # 创建新用户
        user = User(username=username, email=email, password=password)
        db.session.add(user)
        db.session.commit()
        
        # 生成JWT令牌
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'message': '注册成功',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': '注册失败', 'details': str(e)}), 500

@auth_bp.route('/login', methods=['POST'])
def login():
    """用户登录"""
    try:
        data = request.get_json()
        
        if not data or not all(k in data for k in ('username', 'password')):
            return jsonify({'error': '用户名和密码是必填项'}), 400
        
        username = data['username'].strip()
        password = data['password']
        
        # 查找用户（支持用户名或邮箱登录）
        user = User.query.filter(
            (User.username == username) | (User.email == username)
        ).first()
        
        if not user or not user.check_password(password):
            return jsonify({'error': '用户名或密码错误'}), 401
        
        if not user.is_active:
            return jsonify({'error': '账户已被禁用'}), 401
        
        # 生成JWT令牌
        access_token = create_access_token(identity=user.id)
        refresh_token = create_refresh_token(identity=user.id)
        
        return jsonify({
            'message': '登录成功',
            'user': user.to_dict(),
            'access_token': access_token,
            'refresh_token': refresh_token
        })
        
    except Exception as e:
        return jsonify({'error': '登录失败', 'details': str(e)}), 500

@auth_bp.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """刷新访问令牌"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user or not user.is_active:
            return jsonify({'error': '用户不存在或已被禁用'}), 401
        
        new_access_token = create_access_token(identity=current_user_id)
        
        return jsonify({
            'access_token': new_access_token
        })
        
    except Exception as e:
        return jsonify({'error': '令牌刷新失败', 'details': str(e)}), 500

@auth_bp.route('/profile', methods=['GET'])
@jwt_required()
def get_profile():
    """获取用户信息"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(current_user_id)
        
        if not user:
            return jsonify({'error': '用户不存在'}), 404
        
        return jsonify({
            'user': user.to_dict()
        })
        
    except Exception as e:
        return jsonify({'error': '获取用户信息失败', 'details': str(e)}), 500