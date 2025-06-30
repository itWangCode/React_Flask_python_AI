from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity

from app import db
from app.models.user import User, Article


api_bp = Blueprint('api', __name__)
@api_bp.route('/')
def home():
    return {"message": "后端服务运行正常", "status": "success"}

@api_bp.route('/health', methods=['GET'])
def health_check():
    """健康检查"""
    return jsonify({
        'status': 'ok',
        'message': 'Flask API服务器运行正常',
        'environment': 'itwangyang conda env'
    })

@api_bp.route('/users', methods=['GET'])
@jwt_required()
def get_users():
    """获取用户列表"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        
        users = User.query.filter_by(is_active=True).paginate(
            page=page, per_page=per_page, error_out=False
        )
        
        return jsonify({
            'users': [user.to_dict() for user in users.items],
            'total': users.total,
            'pages': users.pages,
            'current_page': page
        })
        
    except Exception as e:
        return jsonify({'error': '获取用户列表失败', 'details': str(e)}), 500

@api_bp.route('/users/<int:user_id>', methods=['GET'])
@jwt_required()
def get_user(user_id):
    """获取单个用户信息"""
    try:
        user = User.query.get_or_404(user_id)
        return jsonify({'user': user.to_dict()})
        
    except Exception as e:
        return jsonify({'error': '获取用户信息失败', 'details': str(e)}), 500

@api_bp.route('/articles', methods=['GET'])
def get_articles():
    """获取文章列表"""
    try:
        page = request.args.get('page', 1, type=int)
        per_page = request.args.get('per_page', 10, type=int)
        status = request.args.get('status', 'published')
        
        query = Article.query.filter_by(status=status)
        articles = query.paginate(page=page, per_page=per_page, error_out=False)
        
        return jsonify({
            'articles': [article.to_dict() for article in articles.items],
            'total': articles.total,
            'pages': articles.pages,
            'current_page': page
        })
        
    except Exception as e:
        return jsonify({'error': '获取文章列表失败', 'details': str(e)}), 500

@api_bp.route('/articles', methods=['POST'])
@jwt_required()
def create_article():
    """创建文章"""
    try:
        data = request.get_json()
        current_user_id = get_jwt_identity()
        
        if not data or 'title' not in data:
            return jsonify({'error': '标题是必填项'}), 400
        
        article = Article(
            title=data['title'],
            content=data.get('content', ''),
            status=data.get('status', 'draft'),
            author_id=current_user_id
        )
        
        db.session.add(article)
        db.session.commit()
        
        return jsonify({
            'message': '文章创建成功',
            'article': article.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': '创建文章失败', 'details': str(e)}), 500

@api_bp.route('/articles/<int:article_id>', methods=['GET'])
def get_article(article_id):
    """获取单篇文章"""
    try:
        article = Article.query.get_or_404(article_id)
        return jsonify({'article': article.to_dict()})
        
    except Exception as e:
        return jsonify({'error': '获取文章失败', 'details': str(e)}), 500

@api_bp.route('/articles/<int:article_id>', methods=['PUT'])
@jwt_required()
def update_article(article_id):
    """更新文章"""
    try:
        current_user_id = get_jwt_identity()
        article = Article.query.get_or_404(article_id)
        
        # 检查权限
        if article.author_id != current_user_id:
            return jsonify({'error': '无权修改此文章'}), 403
        
        data = request.get_json()
        
        if 'title' in data:
            article.title = data['title']
        if 'content' in data:
            article.content = data['content']
        if 'status' in data:
            article.status = data['status']
        
        db.session.commit()
        
        return jsonify({
            'message': '文章更新成功',
            'article': article.to_dict()
        })
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': '更新文章失败', 'details': str(e)}), 500

@api_bp.route('/articles/<int:article_id>', methods=['DELETE'])
@jwt_required()
def delete_article(article_id):
    """删除文章"""
    try:
        current_user_id = get_jwt_identity()
        article = Article.query.get_or_404(article_id)
        
        # 检查权限
        if article.author_id != current_user_id:
            return jsonify({'error': '无权删除此文章'}), 403
        
        db.session.delete(article)
        db.session.commit()
        
        return jsonify({'message': '文章删除成功'})
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': '删除文章失败', 'details': str(e)}), 500