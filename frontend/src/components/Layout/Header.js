import React, { useState, useEffect } from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Box,
  IconButton,
  Menu,
  MenuItem,
  Avatar
} from '@mui/material';
import { AccountCircle } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';
import { authService } from '../../services/auth';

const Header = () => {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (authService.isAuthenticated()) {
      fetchUser();
    }
  }, [location.pathname]);

  const fetchUser = async () => {
    try {
      const response = await authService.getProfile();
      setUser(response.user);
    } catch (error) {
      console.error('获取用户信息失败:', error);
    }
  };

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    setUser(null);
    navigate('/');
    handleClose();
  };

  const navItems = [
    { label: '首页', path: '/' },
    { label: '文章', path: '/articles' },
    { label: '控制台', path: '/dashboard' }
  ];

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          我的应用
        </Typography>

        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
          {navItems.map((item) => (
            <Button
              key={item.path}
              color="inherit"
              onClick={() => navigate(item.path)}
              sx={{
                bgcolor: location.pathname === item.path ? 'rgba(255,255,255,0.1)' : 'transparent'
              }}
            >
              {item.label}
            </Button>
          ))}

          {user ? (
            <div>
              <IconButton
                size="large"
                onClick={handleMenu}
                color="inherit"
              >
                <Avatar sx={{ width: 32, height: 32 }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleClose}
              >
                <MenuItem onClick={() => { navigate('/profile'); handleClose(); }}>
                  个人中心
                </MenuItem>
                <MenuItem onClick={handleLogout}>退出登录</MenuItem>
              </Menu>
            </div>
          ) : (
            <Box>
              <Button color="inherit" onClick={() => navigate('/login')}>
                登录
              </Button>
              <Button color="inherit" onClick={() => navigate('/register')}>
                注册
              </Button>
            </Box>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;