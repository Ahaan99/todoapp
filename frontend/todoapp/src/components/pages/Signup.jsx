import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { FiUser, FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

const Signup = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { register, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, email, password);
    } catch (err) {
      console.error('Registration failed:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full max-w-md mx-auto p-6"
    >
      <Card className="relative overflow-hidden p-8 bg-black/40 backdrop-blur-xl border-purple-500/20 shadow-[0_0_30px_-5px] shadow-purple-500/20">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-transparent to-transparent"
          animate={{ 
            opacity: [0.5, 0.3, 0.5],
            scale: [1, 1.02, 1]
          }}
          transition={{ 
            duration: 5,
            repeat: Infinity,
            repeatType: "reverse"
          }}
        />
        <div className="relative z-10">
          <motion.h2 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-3xl font-bold text-white mb-2 text-center bg-gradient-to-r from-purple-300 to-purple-100 bg-clip-text text-transparent"
          >
            Create Account
          </motion.h2>
          <p className="text-purple-300/60 text-center mb-8">Join Task Master today</p>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FiUser className="absolute left-3 top-3 text-purple-400" />
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="pl-10 bg-black/30 border-purple-500/30 text-white focus:border-purple-500 focus:ring-purple-500/20 placeholder:text-purple-300/50"
                required
              />
            </div>
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-gray-400" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-black/30 border-purple-500/30 text-white focus:border-purple-500 focus:ring-purple-500/20 placeholder:text-purple-300/50"
                required
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-gray-400" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-black/30 border-purple-500/30 text-white focus:border-purple-500 focus:ring-purple-500/20 placeholder:text-purple-300/50"
                required
              />
            </div>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-400 text-sm flex items-center gap-2 bg-red-500/10 p-3 rounded-md"
              >
                <FiAlertCircle className="text-red-400" />
                <span>{error}</span>
              </motion.div>
            )}

            <Button
              type="submit"
              className="w-full bg-purple-600 hover:bg-purple-700 transition-all duration-300 py-6"
              disabled={loading}
            >
              {loading ? (
                <motion.div
                  className="flex items-center gap-2"
                  animate={{ opacity: [1, 0.5, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  Creating account...
                </motion.div>
              ) : (
                'Sign Up'
              )}
            </Button>
          </form>

          <p className="mt-6 text-center text-purple-300/60">
            Already have an account?{' '}
            <button
              onClick={onSwitchToLogin}
              className="text-purple-400 hover:text-purple-300 transition-colors"
            >
              Login
            </button>
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default Signup;
