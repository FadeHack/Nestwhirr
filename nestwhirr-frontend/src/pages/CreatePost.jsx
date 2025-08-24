import { useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useMutation, useQuery } from '@tanstack/react-query';
// import { postService } from '../services/post.service';
// import { subnestService } from '../services/subnest.service';
import { mockPostService as postService } from '../services/mockServices';
import { mockSubnestService as subnestService } from '../services/mockServices';
import useAuthStore from '../store/authStore';
import LoadingSpinner from '../components/common/LoadingSpinner';
import RichTextEditor from '../components/editor/RichTextEditor';
import { FaLink, FaImage, FaFileAlt, FaTimes, FaReddit } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

function PostTypeSelector({ postType, onTypeChange }) {
  const types = [
    { id: 'text', icon: FaFileAlt, label: 'Text' },
    { id: 'image', icon: FaImage, label: 'Image' },
    { id: 'link', icon: FaLink, label: 'Link' },
  ];

  return (
    <div className="flex space-x-4">
      {types.map(({ id, icon: Icon, label }) => (
        <motion.button
          key={id}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => onTypeChange(id)}
          className={`flex items-center p-3 rounded-2xl transition-all ${
            postType === id
              ? 'bg-gradient-to-br from-cyan-500 to-cyan-600 text-white shadow-lg shadow-cyan-500/30'
              : 'bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200'
          }`}
        >
          <Icon className="text-xl" />
          <span className="ml-2 font-medium">{label}</span>
        </motion.button>
      ))}
    </div>
  );
}

function ImageUploadSection({ images, onImageUpload, onImageRemove }) {
  return (
    <div className="space-y-4">
      {images.length > 0 && (
        <div className="grid grid-cols-2 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="relative group rounded-2xl overflow-hidden"
            >
              <img
                src={image}
                alt={`Upload ${index + 1}`}
                className="w-full h-48 object-cover"
              />
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => onImageRemove(index)}
                className="absolute top-2 right-2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <FaTimes />
              </motion.button>
            </motion.div>
          ))}
        </div>
      )}
      <motion.label
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="relative block"
      >
        <div className="h-48 bg-gradient-to-br from-cyan-100 to-cyan-50 dark:from-gray-800 dark:to-gray-700 rounded-2xl border-2 border-dashed border-cyan-300 dark:border-cyan-600 flex flex-col items-center justify-center cursor-pointer group">
          <FaImage className="text-4xl text-cyan-400 dark:text-cyan-500 mb-2 group-hover:scale-110 transition-transform" />
          <span className="text-gray-600 dark:text-gray-300">Drop images here or click to upload</span>
          <span className="text-sm text-gray-500 dark:text-gray-400 mt-1">Supports JPG, PNG, GIF</span>
        </div>
        <input
          type="file"
          className="hidden"
          accept="image/*"
          multiple
          onChange={onImageUpload}
        />
      </motion.label>
    </div>
  );
}

function CreatePost() {
  const navigate = useNavigate();
  const { subnestName } = useParams();
  const [searchParams] = useSearchParams();
  const postType = searchParams.get('type') || 'text';
  const { isAuthenticated } = useAuthStore();
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    subnest: subnestName || '',
    type: postType,
    url: '',
    images: [],
  });

  const { data: subnests } = useQuery({
    queryKey: ['subnests'],
    queryFn: subnestService.getSubnests,
    enabled: !subnestName,
  });

  const createPostMutation = useMutation({
    mutationFn: (postData) => postService.createPost(postData),
    onSuccess: (data) => {
      navigate(`/n/${data.subnest}/comments/${data.id}`);
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isAuthenticated) {
      navigate('/login', { state: { from: location.pathname } });
      return;
    }
    createPostMutation.mutate(formData);
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    const imagePromises = files.map(file => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target.result);
        reader.readAsDataURL(file);
      });
    });

    Promise.all(imagePromises).then(images => {
      setFormData(prev => ({
        ...prev,
        images: [...prev.images, ...images],
      }));
    });
  };

  const removeImage = (index) => {
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  if (createPostMutation.isPending) return <LoadingSpinner />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4"
    >
      <div className="relative">
        {/* Background decorative elements */}
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 rounded-full blur-3xl" />
        <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-gradient-to-br from-cyan-500/10 to-cyan-600/10 rounded-full blur-3xl" />

        {/* Content */}
        <div className="relative space-y-8">
          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent">
                Create a Post
              </h1>
              <p className="text-gray-500 dark:text-gray-400 mt-1">
                Share your thoughts with the community
              </p>
            </div>
            <PostTypeSelector postType={formData.type} onTypeChange={(type) => setFormData(prev => ({ ...prev, type }))} />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Subnest Selection */}
            {!subnestName && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl shadow-cyan-500/5"
              >
                <label className="block text-sm font-medium mb-2">Choose a community</label>
                <div className="relative">
                  <FaReddit className="absolute left-4 top-1/2 -translate-y-1/2 text-cyan-500" />
                  <select
                    value={formData.subnest}
                    onChange={(e) => setFormData(prev => ({ ...prev, subnest: e.target.value }))}
                    required
                    className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all appearance-none"
                  >
                    <option value="">Select a community</option>
                    {subnests?.map((subnest) => (
                      <option key={subnest.name} value={subnest.name}>
                        n/{subnest.name}
                      </option>
                    ))}
                  </select>
                </div>
              </motion.div>
            )}

            {/* Title Input */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl shadow-cyan-500/5"
            >
              <label className="block text-sm font-medium mb-2">Title</label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                required
                className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                placeholder="Write an interesting title..."
              />
            </motion.div>

            {/* Content based on post type */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-xl shadow-cyan-500/5"
            >
              {formData.type === 'text' && (
                <div>
                  <label className="block text-sm font-medium mb-2">Content</label>
                  <RichTextEditor
                    content={formData.content}
                    onChange={(content) => setFormData(prev => ({ ...prev, content }))}
                  />
                </div>
              )}

              {formData.type === 'image' && (
                <ImageUploadSection
                  images={formData.images}
                  onImageUpload={handleImageUpload}
                  onImageRemove={removeImage}
                />
              )}

              {formData.type === 'link' && (
                <div>
                  <label className="block text-sm font-medium mb-2">URL</label>
                  <div className="relative">
                    <FaLink className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                    <input
                      type="url"
                      value={formData.url}
                      onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
                      required
                      className="w-full pl-12 pr-4 py-3 bg-gray-50 dark:bg-gray-700 border-2 border-gray-200 dark:border-gray-600 rounded-xl focus:border-cyan-500 focus:ring-2 focus:ring-cyan-500/20 transition-all"
                      placeholder="https://example.com"
                    />
                  </div>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-4">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => navigate(-1)}
                className="px-6 py-3 text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100 font-medium transition-colors"
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="px-8 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-medium rounded-xl hover:from-cyan-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 shadow-lg shadow-cyan-500/30 transition-all"
              >
                Post
              </motion.button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
}

export default CreatePost; 