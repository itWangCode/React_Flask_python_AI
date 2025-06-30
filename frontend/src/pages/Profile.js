import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Avatar,
  Grid,
  Divider,
  Alert
} from '@mui/material';
import { authService } from '../services/auth';

const Profile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.user);
      setFormData({
        username: response.user.username,
        email: response.user.email
      });
    } catch (error) {
      console.error('获取用户信息失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSave = async () => {
    try {
      // 这里需要添加更新用户信息的API
      setMessage('用户信息更新成功');
      setEditing(false);
    } catch (error) {
      setMessage('更新失败: ' + error.message);
    }
  };

  if (loading) return <Typography>加载中...</Typography>;
  if (!user) return <Typography>用户信息获取失败</Typography>;

  return (
    <Container maxWidth="md" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Box display="flex" alignItems="center" mb={4}>
          <Avatar
            sx={{
              width: 80,
              height: 80,
              mr: 3,
              bgcolor: 'primary.main',
              fontSize: '2rem'
            }}
          >
            {user.username.charAt(0).toUpperCase()}
          </Avatar>
          <Box>
            <Typography variant="h4" gutterBottom>
              个人中心
            </Typography>
            <Typography variant="body1" color="text.secondary">
              管理你的个人信息和设置
            </Typography>
          </Box>
        </Box>

        <Divider sx={{ mb: 4 }} />

        {message && (
          <Alert
            severity={message.includes('成功') ? 'success' : 'error'}
            sx={{ mb: 3 }}
            onClose={() => setMessage('')}
          >
            {message}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="用户名"
              name="username"
              value={editing ? formData.username : user.username}
              onChange={handleChange}
              disabled={!editing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="邮箱"
              name="email"
              type="email"
              value={editing ? formData.email : user.email}
              onChange={handleChange}
              disabled={!editing}
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="注册时间"
              value={new Date(user.created_at).toLocaleDateString('zh-CN')}
              disabled
              margin="normal"
            />
          </Grid>
          <Grid item xs={12} md={6}>
            <TextField
              fullWidth
              label="账户状态"
              value={user.is_active ? '正常' : '已禁用'}
              disabled
              margin="normal"
            />
          </Grid>
        </Grid>

        <Box mt={4} display="flex" gap={2}>
          {editing ? (
            <>
              <Button variant="contained" onClick={handleSave}>
                保存
              </Button>
              <Button variant="outlined" onClick={() => setEditing(false)}>
                取消
              </Button>
            </>
          ) : (
            <Button variant="contained" onClick={() => setEditing(true)}>
              编辑信息
            </Button>
          )}
        </Box>

        <Divider sx={{ my: 4 }} />

        <Typography variant="h6" gutterBottom>
          账户统计
        </Typography>
        <Grid container spacing={2}>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                发布文章
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                草稿文章
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                总浏览量
              </Typography>
            </Paper>
          </Grid>
          <Grid item xs={6} md={3}>
            <Paper sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="h4" color="primary">
                0
              </Typography>
              <Typography variant="body2" color="text.secondary">
                点赞数
              </Typography>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
};

export default Profile;