-- ===================================
-- 创建数据库和表的完整SQL脚本
-- 用户名: root
-- 密码: ITwangyang@520
-- ===================================

-- 1. 创建数据库
DROP DATABASE IF EXISTS myproject_db;
CREATE DATABASE myproject_db
CHARACTER SET utf8mb4
COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE myproject_db;

-- 2. 创建用户表
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- 添加索引
    INDEX idx_username (username),
    INDEX idx_email (email),
    INDEX idx_is_active (is_active)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. 创建文章表
CREATE TABLE articles (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    content TEXT,
    status ENUM('draft', 'published', 'archived') DEFAULT 'draft',
    author_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,

    -- 外键约束
    FOREIGN KEY (author_id) REFERENCES users(id) ON DELETE CASCADE,

    -- 添加索引
    INDEX idx_author_id (author_id),
    INDEX idx_status (status),
    INDEX idx_created_at (created_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. 创建分类表
CREATE TABLE categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 添加索引
    INDEX idx_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. 创建评论表
CREATE TABLE comments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    content TEXT NOT NULL,
    article_id INT NOT NULL,
    user_id INT NOT NULL,
    parent_id INT DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 外键约束
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES comments(id) ON DELETE CASCADE,

    -- 添加索引
    INDEX idx_article_id (article_id),
    INDEX idx_user_id (user_id),
    INDEX idx_parent_id (parent_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. 创建文章分类关联表（多对多关系）
CREATE TABLE article_categories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    article_id INT NOT NULL,
    category_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- 外键约束
    FOREIGN KEY (article_id) REFERENCES articles(id) ON DELETE CASCADE,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE,

    -- 唯一约束（防止重复关联）
    UNIQUE KEY unique_article_category (article_id, category_id),

    -- 添加索引
    INDEX idx_article_id (article_id),
    INDEX idx_category_id (category_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. 插入示例数据
-- 插入用户数据
INSERT INTO users (username, email, password_hash, is_active) VALUES
('admin', 'admin@example.com', 'pbkdf2:sha256:260000$salt$hash', TRUE),
('wangyang', 'wangyang@example.com', 'pbkdf2:sha256:260000$salt$hash', TRUE),
('testuser', 'test@example.com', 'pbkdf2:sha256:260000$salt$hash', TRUE);

-- 插入分类数据
INSERT INTO categories (name, description) VALUES
('技术', '技术相关文章'),
('生活', '生活感悟文章'),
('学习', '学习笔记和心得'),
('项目', '项目开发记录');

-- 插入文章数据
INSERT INTO articles (title, content, status, author_id) VALUES
('Flask项目搭建指南', '这是一篇关于如何搭建Flask项目的详细指南...', 'published', 1),
('React前端开发心得', '在React开发过程中的一些心得体会...', 'published', 2),
('全栈开发学习路线', '分享一个完整的全栈开发学习路线...', 'draft', 1),
('MySQL数据库优化技巧', '数据库性能优化的一些实用技巧...', 'published', 3);

-- 插入文章分类关联数据
INSERT INTO article_categories (article_id, category_id) VALUES
(1, 1), -- Flask项目搭建指南 -> 技术
(1, 4), -- Flask项目搭建指南 -> 项目
(2, 1), -- React前端开发心得 -> 技术
(2, 3), -- React前端开发心得 -> 学习
(3, 3), -- 全栈开发学习路线 -> 学习
(4, 1); -- MySQL数据库优化技巧 -> 技术

-- 插入评论数据
INSERT INTO comments (content, article_id, user_id, parent_id) VALUES
('很详细的教程，感谢分享！', 1, 2, NULL),
('请问有没有视频教程？', 1, 3, NULL),
('可以看看我的博客，有相关视频', 1, 1, 2),
('React确实很强大', 2, 1, NULL),
('期待更多前端文章', 2, 3, NULL);

-- 8. 创建视图（可选）
-- 创建文章详情视图
CREATE VIEW article_details AS
SELECT
    a.id,
    a.title,
    a.content,
    a.status,
    a.created_at,
    a.updated_at,
    u.username as author_name,
    u.email as author_email,
    GROUP_CONCAT(c.name) as categories
FROM articles a
LEFT JOIN users u ON a.author_id = u.id
LEFT JOIN article_categories ac ON a.id = ac.article_id
LEFT JOIN categories c ON ac.category_id = c.id
GROUP BY a.id, a.title, a.content, a.status, a.created_at, a.updated_at, u.username, u.email;

-- 9. 显示创建结果
SHOW TABLES;

-- 显示表结构
DESCRIBE users;
DESCRIBE articles;
DESCRIBE categories;
DESCRIBE comments;
DESCRIBE article_categories;

-- 显示数据统计
SELECT 'users' as table_name, COUNT(*) as count FROM users
UNION ALL
SELECT 'articles' as table_name, COUNT(*) as count FROM articles
UNION ALL
SELECT 'categories' as table_name, COUNT(*) as count FROM categories
UNION ALL
SELECT 'comments' as table_name, COUNT(*) as count FROM comments
UNION ALL
SELECT 'article_categories' as table_name, COUNT(*) as count FROM article_categories;

-- 完成提示
SELECT '✅ 数据库和表创建完成！' as message;