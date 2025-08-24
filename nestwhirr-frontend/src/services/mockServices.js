import { mockApiResponses, simulateApiCall } from '../data/mockData';

// Mock auth service
export const mockAuthService = {
  login: (email, password) => 
    simulateApiCall(mockApiResponses.login),

  register: (username, email, password) =>
    simulateApiCall(mockApiResponses.register),

  getCurrentUser: () =>
    simulateApiCall(mockApiResponses.login.user),

  updateProfile: (userData) =>
    simulateApiCall({ ...mockApiResponses.login.user, ...userData }),

  logout: () =>
    simulateApiCall(null),
};

// Mock post service
export const mockPostService = {
  getPosts: (page = 1) =>
    simulateApiCall(mockApiResponses.getPosts),

  getPost: (postId) =>
    simulateApiCall(mockApiResponses.getPost(Number(postId))),

  getUserPosts: (username) =>
    simulateApiCall(mockApiResponses.getUserPosts(username)),

  getSubnestPosts: (subnestName) =>
    simulateApiCall(mockApiResponses.getSubnestPosts(subnestName)),

  createPost: (postData) =>
    simulateApiCall({
      id: Date.now(),
      ...postData,
      author: 'johndoe',
      score: 1,
      commentCount: 0,
      createdAt: new Date().toISOString(),
      userVote: null,
    }),

  updatePost: (postId, postData) =>
    simulateApiCall({ ...mockApiResponses.getPost(Number(postId)), ...postData }),

  deletePost: (postId) =>
    simulateApiCall({ success: true }),

  votePost: (postId, voteType) =>
    simulateApiCall({
      ...mockApiResponses.getPost(Number(postId)),
      userVote: voteType,
      score: voteType === 'up' ? 43 : 41,
    }),

  getComments: (postId) =>
    simulateApiCall(mockApiResponses.getComments(Number(postId))),

  createComment: (postId, content) =>
    simulateApiCall(mockApiResponses.createComment(Number(postId), content)),

  voteComment: (postId, commentId, voteType) =>
    simulateApiCall({
      ...mockApiResponses.getComments(Number(postId))[0],
      userVote: voteType,
      score: voteType === 'up' ? 16 : 14,
    }),

  searchPosts: (query) =>
    simulateApiCall(
      mockApiResponses.getPosts.posts.filter(
        post =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase())
      )
    ),

  getPopularPosts: () =>
    simulateApiCall(mockApiResponses.getPopularPosts()),
};

// Mock subnest service
export const mockSubnestService = {
  getSubnests: () =>
    simulateApiCall(mockApiResponses.getSubnests()),

  getSubnest: (name) =>
    simulateApiCall(mockApiResponses.getSubnest(name)),

  createSubnest: (data) =>
    simulateApiCall({
      name: data.name,
      description: data.description,
      memberCount: 1,
      onlineCount: 1,
      isSubscribed: true,
      createdAt: new Date().toISOString(),
    }),

  updateSubnest: (name, data) =>
    simulateApiCall({
      ...mockApiResponses.getSubnest(name),
      ...data,
    }),

  subscribeToSubnest: (name) =>
    simulateApiCall(mockApiResponses.subscribeToSubnest(name)),

  unsubscribeFromSubnest: (name) =>
    simulateApiCall(mockApiResponses.unsubscribeFromSubnest(name)),

  getSubnestModerators: (name) =>
    simulateApiCall([
      {
        username: 'johndoe',
        role: 'owner',
        addedAt: '2023-01-01T00:00:00.000Z',
      },
    ]),

  searchSubnests: (query) =>
    simulateApiCall(
      mockApiResponses.getSubnests().filter(sub =>
        sub.name.toLowerCase().includes(query.toLowerCase()) ||
        sub.description.toLowerCase().includes(query.toLowerCase())
      )
    ),
}; 