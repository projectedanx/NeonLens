import React, { useState } from 'react';
import { useAuth } from '../features/auth/AuthContext';
import { Link, useLocation } from 'react-router-dom';
import { Button } from './ui/Button';
import { PlusCircle, Search, Sparkles, User as UserIcon, LogOut, Menu, X } from 'lucide-react';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, login, logout } = useAuth();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <div className="min-h-screen bg-background text-textMain font-sans flex flex-col">
      <nav className="sticky top-0 z-50 w-full border-b border-border bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2 group">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary flex items-center justify-center">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="font-display font-bold text-xl tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 group-hover:to-primary transition-all">
              NeonLens
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className={`text-sm font-medium hover:text-primary transition-colors ${isActive('/') ? 'text-primary' : 'text-textMuted'}`}>
              Gallery
            </Link>
            <Link to="/generate" className={`text-sm font-medium hover:text-primary transition-colors ${isActive('/generate') ? 'text-primary' : 'text-textMuted'}`}>
              Generator
            </Link>
            
            <div className="w-px h-6 bg-border mx-2"></div>

            {user ? (
              <div className="flex items-center gap-4">
                <Link to="/upload">
                  <Button variant="primary" size="sm" className="gap-2">
                    <PlusCircle className="h-4 w-4" />
                    Upload
                  </Button>
                </Link>
                <Link to="/profile" className={`flex items-center gap-2 text-sm font-medium hover:text-white transition-colors ${isActive('/profile') ? 'text-white' : 'text-textMuted'}`}>
                  {user.photoURL ? (
                    <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full border border-border" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-surface border border-border flex items-center justify-center">
                      <UserIcon className="h-4 w-4" />
                    </div>
                  )}
                  <span>{user.displayName}</span>
                </Link>
                <button onClick={() => logout()} className="text-textMuted hover:text-red-400 transition-colors">
                  <LogOut className="h-5 w-5" />
                </button>
              </div>
            ) : (
              <Button onClick={() => login('creator@neonlens.ai')} variant="secondary" size="sm">
                Login / Sign Up
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="md:hidden text-textMain"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Nav */}
        {isMobileMenuOpen && (
          <div className="md:hidden absolute top-16 left-0 w-full bg-surface border-b border-border p-4 flex flex-col gap-4 animate-fade-in">
             <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-textMuted hover:text-primary">Gallery</Link>
             <Link to="/generate" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-textMuted hover:text-primary">Prompt Generator</Link>
             {user ? (
               <>
                 <Link to="/upload" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-textMuted hover:text-primary">Upload Image</Link>
                 <Link to="/profile" onClick={() => setIsMobileMenuOpen(false)} className="block py-2 text-textMuted hover:text-primary">My Profile</Link>
                 <button onClick={() => { logout(); setIsMobileMenuOpen(false); }} className="text-left w-full py-2 text-red-400">Logout</button>
               </>
             ) : (
               <Button onClick={() => { login('creator@neonlens.ai'); setIsMobileMenuOpen(false); }} className="w-full">
                 Login
               </Button>
             )}
          </div>
        )}
      </nav>

      <main className="flex-1 container mx-auto px-4 py-8">
        {children}
      </main>

      <footer className="border-t border-border bg-surface/50 py-8 mt-auto">
        <div className="container mx-auto px-4 text-center text-textMuted text-sm">
          <p>© {new Date().getFullYear()} NeonLens. Built for AI Artists.</p>
        </div>
      </footer>
    </div>
  );
};
