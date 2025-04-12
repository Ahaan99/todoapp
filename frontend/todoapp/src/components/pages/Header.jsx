import React from 'react';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { IoPersonCircleOutline } from 'react-icons/io5';
import { Link } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from '@/context/AuthContext'; // Fix import path

const Header = ({ isLoggedIn, username, onLogout }) => {
  const { user } = useAuth();

  return (
    <div className="flex justify-between items-center mb-8">
      <motion.h1 
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-4xl font-bold text-primary-foreground dark:text-primary-foreground flex items-center gap-2"
      >
        <img src="/icon.png" alt="Task Master Logo" className="h-8 w-8" /> Task Master
      </motion.h1>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="relative h-10 w-10 rounded-full p-0 overflow-hidden">
            {user?.avatar ? (
              <img 
                src={user.avatar} 
                alt={username}
                className="h-full w-full object-cover"
              />
            ) : (
              <IoPersonCircleOutline className="h-6 w-6 text-primary-foreground" />
            )}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end">
          {isLoggedIn ? (
            <>
              <DropdownMenuItem className="font-medium flex items-center gap-2">
                {user?.avatar && (
                  <img 
                    src={user.avatar} 
                    alt={username}
                    className="h-6 w-6 rounded-full object-cover"
                  />
                )}
                {username}
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/dashboard">Dashboard</Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={onLogout}>Logout</DropdownMenuItem>
            </>
          ) : (
            <DropdownMenuItem asChild>
              <Link to="/">Login</Link>
            </DropdownMenuItem>
          )}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};

export default Header;