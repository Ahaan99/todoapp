import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/context/AuthContext';
import { FiMail, FiLock, FiAlertCircle } from 'react-icons/fi';

const Login = ({ onSwitchToSignup }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login, loading, error } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
    } catch (err) {
      console.error('Login failed:', err);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="w-full max-w-md mx-auto p-6"
    >
      <Card className="relative overflow-hidden p-8 bg-slate-900/80 backdrop-blur-xl border border-slate-800 shadow-2xl">
        <div className="relative z-10">
          <h2 className="text-3xl font-bold text-slate-100 mb-2 text-center">
            Welcome Back
          </h2>
          <p className="text-slate-400 text-center mb-8">
            Sign in to continue to Task Master
          </p>
          
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="relative">
              <FiMail className="absolute left-3 top-3 text-slate-400" />
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-slate-100 focus:border-slate-600 focus:ring-slate-600/50 placeholder:text-slate-500"
                required
              />
            </div>
            <div className="relative">
              <FiLock className="absolute left-3 top-3 text-slate-400" />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10 bg-slate-800/50 border-slate-700 text-slate-100 focus:border-slate-600 focus:ring-slate-600/50 placeholder:text-slate-500"
                required
              />
            </div>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-red-300 text-sm flex items-center gap-2 bg-red-500/10 p-3 rounded-md border border-red-500/20"
              >
                <FiAlertCircle className="text-red-400" />
                <span>{error}</span>
              </motion.div>
            )}
            
            <Button
              type="submit"
              className="w-full bg-slate-700 hover:bg-slate-600 text-slate-100 transition-all duration-300 py-6"
              disabled={loading}
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
          
          <p className="mt-6 text-center text-slate-400">
            Don't have an account?{' '}
            <button
              onClick={onSwitchToSignup}
              className="text-slate-300 hover:text-slate-100 transition-colors"
            >
              Sign up
            </button>
          </p>
        </div>
      </Card>
    </motion.div>
  );
};

export default Login;
