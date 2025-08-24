const express = require('express');
const validate = require('../../middlewares/validate');
const authValidation = require('../../validations/auth.validation');
const authController = require('../../controllers/auth.controller');
const auth = require('../../middlewares/auth');

const router = express.Router();

router.post('/register', validate(authValidation.register), authController.register);
router.post('/login', validate(authValidation.login), authController.login);
router.put('/user-preference', auth(), validate(authValidation.userPreference), authController.userPreference);
router.post('/firebase-login', validate(authValidation.firebaseLogin), authController.firebaseLogin);
router.get('/me', auth(), authController.getCurrentUser);

module.exports = router;
/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user with Firebase
 *     requestBody:
 *       description: User registration details
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *               username:
 *                 type: string
 *             required:
 *               - idToken
 *               - username
 *     responses:
 *       '201':
 *         description: User registered successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 *                     username:
 *                       type: string
 *                       example: "johndoe"
 *                     role:
 *                       type: string
 *                       example: "user"
 */
/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login with Firebase token
 *     requestBody:
 *       description: Firebase ID token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *             required:
 *               - idToken
 *     responses:
 *       '200':
 *         description: User information retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     email:
 *                       type: string
 *                       example: "user@example.com"
 */
/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Get current authenticated user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Current user information
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 user:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: string
 *                     email:
 *                       type: string
 *                     username:
 *                       type: string
 *                     role:
 *                       type: string
 *                     roleDetails:
 *                       type: object
 *                       properties:
 *                         name:
 *                           type: string
 *                         permissions:
 *                           type: array
 *                           items:
 *                             type: string
 */
/**
 * @swagger
 * /auth/user-preference:
 *   put:
 *     summary: Update user preferences (username, profile image, etc.)
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       description: User preference settings
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: "johndoe"
 *               photoURL:
 *                 type: string
 *               phoneNumber:
 *                 type: string
 *             minProperties: 1
 *     responses:
 *       '200':
 *         description: User preferences updated successfully
 */
/**
 * @swagger
 * /auth/firebase-login:
 *   post:
 *     summary: Login with Firebase (Google or email/password)
 *     requestBody:
 *       description: Firebase ID token
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idToken:
 *                 type: string
 *             required:
 *               - idToken
 *     responses:
 *       '200':
 *         description: User logged in successfully
 */
