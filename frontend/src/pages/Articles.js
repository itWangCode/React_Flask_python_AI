import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Alert
} from '@mui/material';
import { Add, Edit, Delete } from '@mui/icons-material';
import { articleService } from '../services/auth';

const Articles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    status: 'draft'
  });

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    try {
      const response = await articleService.getArticles();
      setArticles(response.articles || []);
    } catch (error) {
      setError('获取文章失败');
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingArticle(null);
    setFormData({ title: '', content: '', status: 'draft' });
    setOpenDialog(true);
  };

  const handleEdit = (article) => {
    setEditingArticle(article);
    setFormData({
      title: article.title,
      content: article.content,
      status: article.status
    });
    setOpenDialog(true);
  };

  const handleSave = async () => {
    try {
      if (editingArticle) {
        await articleService.updateArticle(editingArticle.id, formData);
      } else {
        await articleService.createArticle(formData);
      }
      setOpenDialog(false);
      fetchArticles();
    } catch (error) {
      setError('保存文章失败');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('确定要删除这篇文章吗？')) {
      try {
        await articleService.deleteArticle(id);
        fetchArticles();
      } catch (error) {
        setError('删除文章失败');
      }
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'published': return 'success';
      case 'draft': return 'default';
      default: return 'default';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'published': return '已发布';
      case 'draft': return '草稿';
      default: return status;
    }
  };

  if (loading) return <Typography>加载中...</Typography>;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
        <Typography variant="h4" component="h1">
          文章管理
        </Typography>
        <Button
          variant="contained"
          startIcon={<Add />}
          onClick={handleCreate}
        >
          新建文章
        </Button>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        {articles.map((article) => (
          <Grid item xs={12} md={6} lg={4} key={article.id}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {article.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {article.content.substring(0, 150)}...
                </Typography>
                <Chip
                  label={getStatusText(article.status)}
                  color={getStatusColor(article.status)}
                  size="small"
                />
              </CardContent>
              <CardActions>
                <Button
                  size="small"
                  startIcon={<Edit />}
                  onClick={() => handleEdit(article)}
                >
                  编辑
                </Button>
                <Button
                  size="small"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleDelete(article.id)}
                >
                  删除
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* 创建/编辑对话框 */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="md" fullWidth>
        <DialogTitle>
          {editingArticle ? '编辑文章' : '新建文章'}
        </DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="标题"
            fullWidth
            variant="outlined"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            margin="dense"
            label="内容"
            fullWidth
            multiline
            rows={10}
            variant="outlined"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            sx={{ mb: 2 }}
          />
          <TextField
            select
            margin="dense"
            label="状态"
            fullWidth
            variant="outlined"
            value={formData.status}
            onChange={(e) => setFormData({ ...formData, status: e.target.value })}
            SelectProps={{
              native: true,
            }}
          >
            <option value="draft">草稿</option>
            <option value="published">发布</option>
          </TextField>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>取消</Button>
          <Button onClick={handleSave} variant="contained">保存</Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Articles;