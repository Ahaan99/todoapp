import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuth } from '@/context/AuthContext';
import { FiUser, FiPhone, FiCalendar, FiEdit2, FiUpload, FiMail, FiEdit3, FiSave, FiX } from 'react-icons/fi';
import axios from 'axios';

const Dashboard = () => {
  const { user, updateUser } = useAuth();
  const [metrics, setMetrics] = useState(null);
  const [metricsError, setMetricsError] = useState(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);
  const [imagePreview, setImagePreview] = useState(user?.avatar || null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    username: user?.username || '',
    email: user?.email || '',
    bio: user?.bio || '',
    phoneNumber: user?.phoneNumber || '',
  });

  const fetchMetrics = async () => {
    if (!user?.token) return;
    
    setIsLoadingMetrics(true);
    setMetricsError(null);

    try {
      const { data } = await axios.get(`http://localhost:5000/api/users/metrics`, {
        headers: { 
          Authorization: `Bearer ${user.token}`
        }
      });
      setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setMetricsError(error.response?.data?.message || 'Failed to load metrics');
      setMetrics(null);
    } finally {
      setIsLoadingMetrics(false);
    }
  };

  useEffect(() => {
    fetchMetrics();

    // Listen for task status changes
    const handleTaskStatusChange = (event) => {
      if (event.detail.type === 'completed') {
        fetchMetrics();
      }
    };

    window.addEventListener('taskStatusChanged', handleTaskStatusChange);

    return () => {
      window.removeEventListener('taskStatusChanged', handleTaskStatusChange);
    };
  }, [user]);

  const handleImageUpload = async (file) => {
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File size must be less than 5MB');
      setImagePreview(user?.avatar || null);
      return;
    }

    const formData = new FormData();
    formData.append('avatar', file);

    setIsUploading(true);
    setUploadError(null);

    try {
      const { data } = await axios.put(
        'http://localhost:5000/api/users/profile',
        formData,
        {
          headers: {
            Authorization: `Bearer ${user.token}`,
            'Content-Type': 'multipart/form-data',
          }
        }
      );

      if (data.success) {
        updateUser({ avatar: data.avatar });
        setImagePreview(data.avatar);
        setUploadError(null);
      } else {
        throw new Error(data.message || 'Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      setUploadError(error.response?.data?.message || error.message || 'Failed to upload image');
      setImagePreview(user?.avatar || null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Show preview immediately
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
      
      // Upload the file
      handleImageUpload(file);
    }
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put(
        'http://localhost:5000/api/users/profile',
        profileData,
        {
          headers: { Authorization: `Bearer ${user.token}` }
        }
      );
      updateUser(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="md:col-span-1 p-6 bg-white shadow-lg rounded-xl border border-gray-100">
            <div className="flex flex-col items-center space-y-4">
              <div className="relative">
                {imagePreview ? (
                  <img
                    src={imagePreview}
                    alt="Profile Preview"
                    className="w-32 h-32 rounded-full object-cover border-4 border-blue-100 shadow-md"
                  />
                ) : (
                  <div className="w-32 h-32 rounded-full bg-blue-50 flex items-center justify-center shadow-md">
                    <FiUser size={40} className="text-blue-400" />
                  </div>
                )}
                <label className={`absolute bottom-0 right-0 p-2 ${isUploading ? 'bg-gray-500' : 'bg-blue-500 hover:bg-blue-600'} rounded-full cursor-pointer transition-colors shadow-md`}>
                  <FiUpload className="text-white" />
                  <input
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleImageChange}
                    disabled={isUploading}
                  />
                </label>
              </div>
              <div className="w-full">
                {!isEditing ? (
                  <div className="text-center space-y-2">
                    <h2 className="text-xl font-semibold text-gray-800">{user?.username}</h2>
                    <p className="text-gray-500 text-sm">{user?.email}</p>
                    {user?.bio && <p className="text-gray-600">{user.bio}</p>}
                    {user?.phoneNumber && (
                      <p className="text-gray-500 text-sm">{user.phoneNumber}</p>
                    )}
                    <Button
                      onClick={() => setIsEditing(true)}
                      variant="outline"
                      className="mt-4"
                    >
                      <FiEdit3 className="mr-2" /> Edit Profile
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="space-y-4 w-full">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Username</label>
                      <Input
                        value={profileData.username}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          username: e.target.value
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Email</label>
                      <Input
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          email: e.target.value
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Bio</label>
                      <textarea
                        value={profileData.bio}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          bio: e.target.value
                        })}
                        className="w-full mt-1 rounded-md border border-gray-300 p-2 min-h-[80px]"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-700">Phone Number</label>
                      <Input
                        type="tel"
                        value={profileData.phoneNumber}
                        onChange={(e) => setProfileData({
                          ...profileData,
                          phoneNumber: e.target.value
                        })}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button type="submit" className="flex-1">
                        <FiSave className="mr-2" /> Save Changes
                      </Button>
                      <Button 
                        type="button" 
                        variant="outline"
                        onClick={() => setIsEditing(false)}
                      >
                        <FiX className="mr-2" /> Cancel
                      </Button>
                    </div>
                  </form>
                )}
              </div>
              {uploadError && (
                <div className="text-red-500 text-sm mt-2 text-center">
                  {uploadError}
                </div>
              )}
            </div>
          </Card>

          <div className="md:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-4">
            {metricsError ? (
              <div className="col-span-2 p-4 text-red-500 bg-red-100 rounded-lg">
                {metricsError}
              </div>
            ) : isLoadingMetrics ? (
              <div className="col-span-2 p-4 text-center">
                Loading metrics...
              </div>
            ) : (
              <>
                <Card className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-xl shadow-lg">
                  <h3 className="text-lg font-medium text-blue-50 mb-2">Task Completion</h3>
                  <div className="text-3xl font-bold">
                    {metrics?.completionRate || 0}%
                  </div>
                  <p className="text-blue-100 text-sm">Average completion rate</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-xl shadow-lg">
                  <h3 className="text-lg font-medium text-purple-50 mb-2">Current Streak</h3>
                  <div className="text-3xl font-bold">
                    {metrics?.streakDays || 0} days
                  </div>
                  <p className="text-purple-100 text-sm">Consecutive days active</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-green-500 to-green-600 text-white rounded-xl shadow-lg">
                  <h3 className="text-lg font-medium text-green-50 mb-2">Tasks Completed</h3>
                  <div className="text-3xl font-bold">
                    {metrics?.tasksCompleted || 0}
                  </div>
                  <p className="text-green-100 text-sm">Total tasks completed</p>
                </Card>

                <Card className="p-6 bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-xl shadow-lg">
                  <h3 className="text-lg font-medium text-orange-50 mb-2">Efficiency Score</h3>
                  <div className="text-3xl font-bold">
                    {metrics?.efficiencyScore || 0}/100
                  </div>
                  <p className="text-orange-100 text-sm">Based on completion time</p>
                </Card>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
