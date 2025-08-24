/**
 * Define all application roles and their associated permissions for a Reddit-like application
 */
const allRoles = {
  user: [
    // Content creation
    'createPost', 
    'createComment', 
    'editOwnPost', 
    'editOwnComment', 
    'deleteOwnPost', 
    'deleteOwnComment',
    
    // Voting
    'upvotePost', 
    'downvotePost', 
    'upvoteComment', 
    'downvoteComment',
    
    // Community
    'joinCommunity', 
    'leaveCommunity',
    
    // User profile
    'updateOwnProfile', 
    'deleteOwnAccount',
    
    // Search and view
    'searchContent', 
    'viewContent', 
    'viewUsers',
    'viewCommunities'
  ],
  
  moderator: [
    // All user permissions
    'createPost', 'createComment', 'editOwnPost', 'editOwnComment', 'deleteOwnPost', 'deleteOwnComment',
    'upvotePost', 'downvotePost', 'upvoteComment', 'downvoteComment',
    'joinCommunity', 'leaveCommunity',
    'updateOwnProfile', 'deleteOwnAccount',
    'searchContent', 'viewContent', 'viewUsers', 'viewCommunities',
    
    // Moderation permissions
    'removePost', 
    'removeComment',
    'banUserFromCommunity', 
    'unbanUserFromCommunity',
    'pinPost',
    'manageCommunitySettings'
  ],
  
  admin: [
    // All user and moderator permissions
    'createPost', 'createComment', 'editOwnPost', 'editOwnComment', 'deleteOwnPost', 'deleteOwnComment',
    'upvotePost', 'downvotePost', 'upvoteComment', 'downvoteComment',
    'joinCommunity', 'leaveCommunity',
    'updateOwnProfile', 'deleteOwnAccount',
    'searchContent', 'viewContent', 'viewUsers', 'viewCommunities',
    'removePost', 'removeComment', 'banUserFromCommunity', 'unbanUserFromCommunity', 'pinPost',
    'manageCommunitySettings',
    
    // Admin permissions
    'createCommunity',
    'deleteCommunity',
    'manageAllCommunities',
    'manageUsers',
    'manageRoles',
    'viewMetrics'
  ],
  
  superAdmin: [
    // All permissions
    'createPost', 'createComment', 'editOwnPost', 'editOwnComment', 'deleteOwnPost', 'deleteOwnComment',
    'upvotePost', 'downvotePost', 'upvoteComment', 'downvoteComment',
    'joinCommunity', 'leaveCommunity',
    'updateOwnProfile', 'deleteOwnAccount',
    'searchContent', 'viewContent', 'viewUsers', 'viewCommunities',
    'removePost', 'removeComment', 'banUserFromCommunity', 'unbanUserFromCommunity', 'pinPost',
    'manageCommunitySettings',
    'createCommunity', 'deleteCommunity', 'manageAllCommunities', 'manageUsers', 'manageRoles', 'viewMetrics',
    
    // System permissions
    'manageSystem',
    'viewAllData',
    'assignSuperAdmin'
  ]
};

/**
 * List of all roles in the system
 */
const roles = Object.keys(allRoles);

/**
 * Map of roles to their permissions
 */
const roleRights = new Map(Object.entries(allRoles));

/**
 * Default role for new users
 */
const defaultRole = 'user';

/**
 * Role priority levels (higher number means higher priority)
 */
const rolePriorities = {
  user: 0,
  moderator: 1,
  admin: 2,
  superAdmin: 3
};

module.exports = {
  roles,
  roleRights,
  defaultRole,
  rolePriorities
};
