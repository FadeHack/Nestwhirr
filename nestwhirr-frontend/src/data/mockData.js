// Mock user data
export const currentUser = {
  id: 1,
  username: 'johndoe',
  email: 'john@example.com',
  password: 'password',
  createdAt: '2024-01-01T00:00:00.000Z',
};

// Mock popular posts data
export const popularPosts = [
  {
    id: 'pop1',
    title: "Scientists discover breakthrough in quantum computing that could revolutionize modern technology",
    subnest: "science",
    upvotes: 45200,
    comments: 3200,
    thumbnail: "https://picsum.photos/800/400?random=1",
    excerpt: "Researchers at a leading institution have made a groundbreaking discovery in quantum computing that could significantly impact various fields including cryptography and drug discovery.",
    author: "quantum_researcher",
    createdAt: "2024-02-20T10:00:00.000Z"
  },
  {
    id: 'pop2',
    title: "This artist spent 300 hours creating this hyperrealistic drawing using only pencils",
    subnest: "art",
    upvotes: 32100,
    comments: 1500,
    thumbnail: "https://picsum.photos/800/400?random=2",
    excerpt: "An incredible showcase of patience and skill resulting in a piece that's almost indistinguishable from a photograph.",
    author: "artistic_soul",
    createdAt: "2024-02-20T08:30:00.000Z"
  },
  {
    id: 'pop3',
    title: "New gaming console announced with groundbreaking features",
    subnest: "gaming",
    upvotes: 28900,
    comments: 4100,
    thumbnail: "https://picsum.photos/800/400?random=3",
    excerpt: "The next generation of gaming is here with unprecedented graphics capabilities and innovative control systems.",
    author: "gaming_news",
    createdAt: "2024-02-20T09:15:00.000Z"
  }
];

// Mock posts data
export const posts = [
  {
    id: 1,
    title: 'First Post in React Subnest',
    content: 'This is a test post about React development',
    author: 'johndoe',
    subnest: 'react',
    score: 42,
    commentCount: 5,
    createdAt: '2024-02-15T10:00:00.000Z',
    userVote: 'up',
  },
  {
    id: 2,
    title: 'JavaScript Tips and Tricks',
    content: 'Here are some useful JavaScript tips...',
    author: 'janedoe',
    subnest: 'javascript',
    score: 28,
    commentCount: 3,
    createdAt: '2024-02-14T15:30:00.000Z',
    userVote: null,
  },
];

// Mock comments data
export const comments = [
  {
    id: 1,
    content: 'Great post! Very helpful.',
    author: 'janedoe',
    postId: 1,
    score: 15,
    createdAt: '2024-02-15T11:00:00.000Z',
    userVote: null,
  },
  {
    id: 2,
    content: 'Thanks for sharing this!',
    author: 'bobsmith',
    postId: 1,
    score: 8,
    createdAt: '2024-02-15T12:30:00.000Z',
    userVote: 'up',
  },
];

// Mock subnests data
export const subnests = [
  {
    name: 'programming',
    description: 'Discussion and news about programming',
    memberCount: 4500000,
    onlineCount: 8500,
    isSubscribed: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    banner: 'https://picsum.photos/800/200?random=1',
  },
  {
    name: 'react',
    description: 'A community for learning and sharing React knowledge',
    memberCount: 800000,
    onlineCount: 2500,
    isSubscribed: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    banner: 'https://picsum.photos/800/200?random=2',
  },
  {
    name: 'javascript',
    description: 'All about JavaScript programming',
    memberCount: 1200000,
    onlineCount: 3500,
    isSubscribed: false,
    createdAt: '2023-01-01T00:00:00.000Z',
    banner: 'https://picsum.photos/800/200?random=3',
  },
  {
    name: 'webdev',
    description: 'A community dedicated to all things web development',
    memberCount: 950000,
    onlineCount: 2800,
    isSubscribed: false,
    createdAt: '2023-01-01T00:00:00.000Z',
    banner: 'https://picsum.photos/800/200?random=4',
  },
  {
    name: 'science',
    description: 'The science subnest is a place to share new findings',
    memberCount: 2800000,
    onlineCount: 5500,
    isSubscribed: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    banner: 'https://picsum.photos/800/200?random=5',
  },
  {
    name: 'art',
    description: 'Share your artwork and discover new artists',
    memberCount: 1500000,
    onlineCount: 3200,
    isSubscribed: false,
    createdAt: '2023-01-01T00:00:00.000Z',
    banner: 'https://picsum.photos/800/200?random=6',
  },
  {
    name: 'gaming',
    description: 'A place for gaming news and discussions',
    memberCount: 3500000,
    onlineCount: 12000,
    isSubscribed: true,
    createdAt: '2023-01-01T00:00:00.000Z',
    banner: 'https://picsum.photos/800/200?random=7',
  }
];

// Mock API responses
export const mockApiResponses = {
  // Auth responses
  login: {
    user: currentUser,
    token: 'mock-jwt-token',
  },
  register: {
    user: currentUser,
    token: 'mock-jwt-token',
  },

  // Posts responses
  getPosts: {
    posts,
    nextPage: null,
  },
  getPost: (id) => posts.find(post => post.id === id),
  getUserPosts: (username) => ({
    user: currentUser,
    posts: posts.filter(post => post.author === username),
  }),
  getSubnestPosts: (subnestName) => 
    posts.filter(post => post.subnest === subnestName),

  // Comments responses
  getComments: (postId) => 
    comments.filter(comment => comment.postId === postId),
  createComment: (postId, content) => ({
    id: comments.length + 1,
    content,
    author: currentUser.username,
    postId,
    score: 1,
    createdAt: new Date().toISOString(),
    userVote: null,
  }),

  // Subnest responses
  getSubnests: () => subnests,
  getSubnest: (name) => subnests.find(sub => sub.name === name),
  subscribeToSubnest: (name) => ({
    ...subnests.find(sub => sub.name === name),
    isSubscribed: true,
  }),
  unsubscribeFromSubnest: (name) => ({
    ...subnests.find(sub => sub.name === name),
    isSubscribed: false,
  }),

  // Add popular posts response
  getPopularPosts: () => popularPosts,
};

// Helper function to simulate API delay
export const simulateApiCall = async (response, delay = 500) => {
  await new Promise(resolve => setTimeout(resolve, delay));
  return response;
}; 