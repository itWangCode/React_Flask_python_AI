import React from 'react';
import { Container, Typography, Box, Card, CardContent, Button, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { Article, Person, Dashboard } from '@mui/icons-material';

const Home = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Article sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: '文章管理',
      description: '创建、编辑和管理你的文章',
      action: () => navigate('/articles')
    },
    {
      icon: <Person sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: '用户中心',
      description: '管理个人信息和设置',
      action: () => navigate('/profile')
    },
    {
      icon: <Dashboard sx={{ fontSize: 40, color: '#1976d2' }} />,
      title: '控制面板',
      description: '查看统计数据和分析',
      action: () => navigate('/dashboard')
    }
  ];

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Box textAlign="center" mb={6}>
        <Typography variant="h2" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
          欢迎来到我的应用
        </Typography>
        <Typography variant="h5" color="text.secondary" paragraph>
          现代化的全栈Web应用，基于React + Flask构建
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {features.map((feature, index) => (
          <Grid item xs={12} md={4} key={index}>
            <Card
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: 3
                }
              }}
              onClick={feature.action}
            >
              <CardContent sx={{ textAlign: 'center', p: 4 }}>
                <Box mb={2}>
                  {feature.icon}
                </Box>
                <Typography variant="h5" component="h2" gutterBottom>
                  {feature.title}
                </Typography>
                <Typography variant="body1" color="text.secondary" paragraph>
                  {feature.description}
                </Typography>
                <Button variant="contained" color="primary">
                  进入
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default Home;