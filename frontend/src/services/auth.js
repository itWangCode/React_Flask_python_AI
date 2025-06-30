import api from './api';

export const authService = {
  // 用户注册
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    return response.data;
  },

  // 用户登录
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.access_token) {
      localStorage.setItem('access_token', response.data.access_token);
      localStorage.setItem('refresh_token', response.data.refresh_token);
    }
    return response.data;
  },

  // 退出登录
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },

  // 获取用户信息
  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },

  // 检查是否已登录
  isAuthenticated: () => {
    return !!localStorage.getItem('access_token');
  },

  // 刷新token
  refreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    const response = await api.post('/auth/refresh', {}, {
      headers: { Authorization: `Bearer ${refreshToken}` }
    });
    localStorage.setItem('access_token', response.data.access_token);
    return response.data;
  }
};

// 文章相关API
export const articleService = {
  // 获取文章列表
  getArticles: async (params = {}) => {
    const response = await api.get('/api/articles', { params });
    return response.data;
  },

  // 获取单篇文章
  getArticle: async (id) => {
    const response = await api.get(`/api/articles/${id}`);
    return response.data;
  },

  // 创建文章
  createArticle: async (articleData) => {
    const response = await api.post('/api/articles', articleData);
    return response.data;
  },

  // 更新文章
  updateArticle: async (id, articleData) => {
    const response = await api.put(`/api/articles/${id}`, articleData);
    return response.data;
  },

  // 删除文章
  deleteArticle: async (id) => {
    const response = await api.delete(`/api/articles/${id}`);
    return response.data;
  }
};

// 用户相关API
export const userService = {
  // 获取用户列表
  getUsers: async (params = {}) => {
    const response = await api.get('/api/users', { params });
    return response.data;
  },

  // 获取单个用户
  getUser: async (id) => {
    const response = await api.get(`/api/users/${id}`);
    return response.data;
  }
};