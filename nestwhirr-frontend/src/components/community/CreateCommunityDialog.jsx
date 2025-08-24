import { useState, useEffect } from 'react';
import { useMutation } from '@tanstack/react-query';
import { mockSubnestService as subnestService } from '../../services/mockServices';
import { FaTimes, FaImage, FaReddit, FaLock, FaGlobe, FaUserShield } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import nestwhirrLogo from '../../assets/nestwhirr.png';

const COMMUNITY_TYPES = [
  {
    id: 'public',
    icon: FaGlobe,
    label: 'Public',
    description: 'Anyone can view, post, and comment to this community',
  },
  {
    id: 'restricted',
    icon: FaUserShield,
    label: 'Restricted',
    description: 'Anyone can view this community, but only approved users can post',
  },
  {
    id: 'private',
    icon: FaLock,
    label: 'Private',
    description: 'Only approved users can view and submit to this community',
  },
];

const TOPICS = [
  'Gaming', 'Sports', 'Technology', 'Entertainment', 'Science', 'Politics',
  'News', 'Education', 'Art', 'Music', 'Food', 'Travel', 'Fashion', 'Fitness',
  'Photography', 'Movies', 'Books', 'DIY', 'Pets', 'Nature'
];

function Step1({ formData, setFormData, nextStep }) {
  const handleNameChange = (e) => {
    const value = e.target.value.replace(/[^a-zA-Z0-9_]/g, '');
    setFormData(prev => ({ ...prev, name: value }));
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-2">Community Name</label>
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">n/</span>
          <input
            type="text"
            value={formData.name}
            onChange={handleNameChange}
            maxLength={21}
            className="w-full pl-8 pr-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent"
            placeholder="community_name"
          />
        </div>
        <p className="mt-2 text-sm text-gray-500">
          {21 - formData.name.length} characters remaining
        </p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Community Description</label>
        <textarea
          value={formData.description}
          onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
          rows={4}
          className="w-full px-4 py-3 bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-cyan-500 focus:border-transparent resize-none"
          placeholder="Tell us about your community..."
        />
      </div>

      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        onClick={nextStep}
        disabled={!formData.name}
        className="w-full py-3 px-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      >
        Next
      </motion.button>
    </div>
  );
}

function Step2({ formData, setFormData, nextStep, prevStep }) {
  const handleImageUpload = (e, type) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setFormData(prev => ({
          ...prev,
          [type]: e.target?.result
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-4">Community Banner</label>
        <div className="relative">
          {formData.banner ? (
            <div className="relative rounded-lg overflow-hidden">
              <img
                src={formData.banner}
                alt="Banner preview"
                className="w-full h-32 object-cover"
              />
              <button
                onClick={() => setFormData(prev => ({ ...prev, banner: null }))}
                className="absolute top-2 right-2 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg cursor-pointer hover:border-cyan-500 transition-colors">
              <FaImage className="text-3xl text-gray-400 mb-2" />
              <span className="text-sm text-gray-500">Upload banner image</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'banner')}
              />
            </label>
          )}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-4">Community Icon</label>
        <div className="relative">
          {formData.icon ? (
            <div className="relative w-24 h-24 mx-auto">
              <img
                src={formData.icon}
                alt="Icon preview"
                className="w-full h-full rounded-full object-cover"
              />
              <button
                onClick={() => setFormData(prev => ({ ...prev, icon: null }))}
                className="absolute -top-1 -right-1 p-1 bg-black/50 text-white rounded-full hover:bg-black/70"
              >
                <FaTimes />
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center w-24 h-24 mx-auto border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-full cursor-pointer hover:border-cyan-500 transition-colors">
              <FaImage className="text-2xl text-gray-400 mb-1" />
              <span className="text-xs text-gray-500">Upload icon</span>
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={(e) => handleImageUpload(e, 'icon')}
              />
            </label>
          )}
        </div>
      </div>

      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={prevStep}
          className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium transition-all"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={nextStep}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 font-medium transition-all"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
}

function Step3({ formData, setFormData, nextStep, prevStep }) {
  const toggleTopic = (topic) => {
    setFormData(prev => {
      const topics = new Set(prev.topics);
      if (topics.has(topic)) {
        topics.delete(topic);
      } else if (topics.size < 3) {
        topics.add(topic);
      }
      return { ...prev, topics: Array.from(topics) };
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-4">
          Select up to 3 topics that best describe your community
        </label>
        <div className="grid grid-cols-2 gap-2">
          {TOPICS.map((topic) => (
            <button
              key={topic}
              onClick={() => toggleTopic(topic)}
              className={`p-3 rounded-lg text-sm font-medium transition-all ${
                formData.topics.includes(topic)
                  ? 'bg-cyan-500 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={prevStep}
          className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium transition-all"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={nextStep}
          disabled={formData.topics.length === 0}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </motion.button>
      </div>
    </div>
  );
}

function Step4({ formData, setFormData, prevStep, onSubmit }) {
  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium mb-4">Community Type</label>
        <div className="space-y-3">
          {COMMUNITY_TYPES.map(({ id, icon: Icon, label, description }) => (
            <button
              key={id}
              onClick={() => setFormData(prev => ({ ...prev, type: id }))}
              className={`w-full flex items-start p-4 rounded-xl border-2 transition-all ${
                formData.type === id
                  ? 'border-cyan-500 bg-cyan-50 dark:bg-cyan-500/10'
                  : 'border-gray-200 dark:border-gray-700 hover:border-cyan-500/50'
              }`}
            >
              <Icon className={`text-xl mt-0.5 ${
                formData.type === id ? 'text-cyan-500' : 'text-gray-400'
              }`} />
              <div className="ml-3 text-left">
                <div className="font-medium">{label}</div>
                <div className="text-sm text-gray-500 dark:text-gray-400">{description}</div>
              </div>
            </button>
          ))}
        </div>
      </div>

      <div className="flex space-x-3">
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={prevStep}
          className="flex-1 py-3 px-4 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-200 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 font-medium transition-all"
        >
          Back
        </motion.button>
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          onClick={onSubmit}
          disabled={!formData.type}
          className="flex-1 py-3 px-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-xl hover:from-cyan-600 hover:to-cyan-700 focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:ring-offset-2 font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Create Community
        </motion.button>
      </div>
    </div>
  );
}

function CreateCommunityDialog({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    banner: null,
    icon: null,
    topics: [],
    type: 'public',
  });

  // Reset form when dialog closes
  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setFormData({
        name: '',
        description: '',
        banner: null,
        icon: null,
        topics: [],
        type: 'public',
      });
    }
  }, [isOpen]);

  const createCommunityMutation = useMutation({
    mutationFn: (data) => subnestService.createSubnest(data),
    onSuccess: () => {
      onClose();
      // You might want to add a success notification here
    },
  });

  const handleSubmit = () => {
    createCommunityMutation.mutate(formData);
  };

  const renderStep = () => {
    switch (step) {
      case 1:
        return <Step1 formData={formData} setFormData={setFormData} nextStep={() => setStep(2)} />;
      case 2:
        return (
          <Step2
            formData={formData}
            setFormData={setFormData}
            nextStep={() => setStep(3)}
            prevStep={() => setStep(1)}
          />
        );
      case 3:
        return (
          <Step3
            formData={formData}
            setFormData={setFormData}
            nextStep={() => setStep(4)}
            prevStep={() => setStep(2)}
          />
        );
      case 4:
        return (
          <Step4
            formData={formData}
            setFormData={setFormData}
            prevStep={() => setStep(3)}
            onSubmit={handleSubmit}
          />
        );
      default:
        return null;
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onClose}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            />

            {/* Dialog */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="relative w-full max-w-md transform overflow-hidden rounded-2xl bg-white dark:bg-gray-800 p-8 text-left shadow-xl transition-all"
            >
              {/* Close button */}
              <motion.button
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="absolute top-4 right-4 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
              >
                <FaTimes className="text-xl" />
              </motion.button>

              {/* Header */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", duration: 0.5 }}
                  className="flex justify-center mb-4"
                >
                  <div className="p-3 bg-cyan-100 dark:bg-cyan-500/20 rounded-full">
                    <img src={nestwhirrLogo} alt="Nestwhirr" className="w-10 h-10" />
                  </div>
                </motion.div>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-cyan-500 to-cyan-600 bg-clip-text text-transparent">
                    Create a Community
                  </h2>
                  <div className="flex justify-center mt-4">
                    <div className="flex items-center space-x-2">
                      {[1, 2, 3, 4].map((i) => (
                        <div
                          key={i}
                          className={`w-2.5 h-2.5 rounded-full transition-colors ${
                            i === step
                              ? 'bg-cyan-500'
                              : i < step
                              ? 'bg-cyan-200 dark:bg-cyan-800'
                              : 'bg-gray-200 dark:bg-gray-700'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Content */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {renderStep()}
              </motion.div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}

export default CreateCommunityDialog; 