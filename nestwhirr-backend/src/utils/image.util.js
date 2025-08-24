const { s3BucketService } = require("../services");

/**
 * Generate presigned URLs for an array of image keys.
 * @param {string} requestId - The ID of the request.
 * @param {string[]} imageKeys - The array of image keys.
 * @returns {Promise<Object[]>} - An array of objects containing image keys and their URLs.
 */
const generatePresignedUrls = async (requestId, imageKeys) => {
    return Promise.all(imageKeys.map(async (imageKey) => {
        const imageUrl = await s3BucketService.getPresignedUrl(requestId, imageKey);
        return { key: imageKey, url: imageUrl };
    }));
};

module.exports = { generatePresignedUrls };
