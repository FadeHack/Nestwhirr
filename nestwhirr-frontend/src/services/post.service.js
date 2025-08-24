import api from './api';

export const postService = {
  async getPosts(page = 1, limit = 10) {
    const response = await api.get('/posts', {
      params: { page, limit },
    });
    return response.data;
  },

  async getPost(postId) {
    const response = await api.get(`/posts/${postId}`);
    return response.data;
  },

  async createPost(postData) {
    const response = await api.post('/posts', postData);
    return response.data;
  },

  async updatePost(postId, postData) {
    const response = await api.put(`/posts/${postId}`, postData);
    return response.data;
  },

  async deletePost(postId) {
    const response = await api.delete(`/posts/${postId}`);
    return response.data;
  },

  async votePost(postId, voteType) {
    const response = await api.post(`/posts/${postId}/vote`, { voteType });
    return response.data;
  },

  async getComments(postId) {
    const response = await api.get(`/posts/${postId}/comments`);
    return response.data;
  },

  async createComment(postId, content) {
    const response = await api.post(`/posts/${postId}/comments`, { content });
    return response.data;
  },

  async getSubnestPosts(subnestName, page = 1, limit = 10) {
    const response = await api.get(`/n/${subnestName}/posts`, {
      params: { page, limit },
    });
    return response.data;
  },
}; 