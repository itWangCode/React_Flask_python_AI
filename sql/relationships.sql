-- 添加外键关系
ALTER TABLE articles 
ADD CONSTRAINT fk_articles_category 
FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL;

-- 创建索引提高查询性能
CREATE INDEX idx_articles_author ON articles(author_id);
CREATE INDEX idx_articles_category ON articles(category_id);
CREATE INDEX idx_comments_article ON comments(article_id);
CREATE INDEX idx_comments_user ON comments(user_id);