import React, { useState, useEffect } from 'react';
import { Container, Typography, Grid, Card, CardContent, Box } from '@mui/material';
import { Article, Person, TrendingUp } from '@mui/icons-material';

const Dashboard = () => {
  const [stats, setStats] = useState({
    articles: 0,
    users: 0,
    views: 0
  });

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" gutterBottom>
        控制面板
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Article color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    文章总数
                  </Typography>
                  <Typography variant="h5">
                    {stats.articles}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <Person color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    用户总数
                  </Typography>
                  <Typography variant="h5">
                    {stats.users}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={4}>
          <Card>
            <CardContent>
              <Box display="flex" alignItems="center">
                <TrendingUp color="primary" sx={{ mr: 2 }} />
                <Box>
                  <Typography color="textSecondary" gutterBottom>
                    总浏览量
                  </Typography>
                  <Typography variant="h5">
                    {stats.views}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dashboard;