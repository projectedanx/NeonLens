import React, { useState } from 'react';
import { Image } from '../../types';
import { useAuth } from '../auth/AuthContext';
import { MockService } from '../../services/mockService';
import { Copy, Check, Heart } from 'lucide-react';

interface ImageCardProps {
  image: Image;
}

export const ImageCard: React.FC<ImageCardProps> = ({ image }) => {
  const { user } = useAuth();
  const [copied, setCopied] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
  
  // Local state for optimistic UI updates
  const [likes, setLikes] = useState(image.likes);
  const [isLiked, setIsLiked] = useState(user ? image.likedBy.includes(user.uid) : false);
  const [isLiking, setIsLiking] = useState(false);

  const handleCopy = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(image.prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLike = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!user) {
        // In a real app, trigger login modal
        alert("Please login to like images");
        return;
    }

    if (isLiking) return;

    // Optimistic Update
    const previousLikes = likes;
    const previousIsLiked = isLiked;
    
    setIsLiking(true);
    setLikes(prev => isLiked ? prev - 1 : prev + 1);
    setIsLiked(prev => !prev);

    try {
        await MockService.toggleLike(image.id, user.uid);
    } catch (error) {
        // Revert on error
        setLikes(previousLikes);
        setIsLiked(previousIsLiked);
        console.error("Failed to toggle like", error);
    } finally {
        setIsLiking(false);
    }
  };

  return (
    <div className="group relative break-inside-avoid mb-6 rounded-xl overflow-hidden bg-surface border border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_-10px_rgba(6,182,212,0.3)]">
      
      {/* Skeleton Loader */}
      {!isLoaded && (
        <div className="absolute inset-0 bg-surfaceHighlight animate-pulse z-10 h-64" />
      )}

      {/* Image */}
      <img
        src={image.imageUrl}
        alt={image.prompt.slice(0, 50)}
        loading="lazy"
        onLoad={() => setIsLoaded(true)}
        className={`w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
      />

      {/* Overlay - Always visible on mobile, hover on desktop */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
        
        <div className="translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              {image.userPhotoURL && (
                <img src={image.userPhotoURL} className="w-6 h-6 rounded-full border border-white/20" alt="avatar" />
              )}
              <span className="text-xs font-medium text-white/90">{image.userDisplayName}</span>
            </div>
            <div className="flex gap-1">
                {image.style.slice(0, 1).map(s => (
                    <span key={s} className="text-[10px] px-2 py-0.5 rounded-full bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm">
                        {s}
                    </span>
                ))}
            </div>
          </div>

          <p className="text-sm text-gray-300 line-clamp-2 mb-3 font-light italic">
            "{image.prompt}"
          </p>

          <div className="flex items-center justify-between gap-2">
            <button 
              onClick={handleCopy}
              className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-medium transition-all ${
                copied 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/50' 
                  : 'bg-white/10 text-white hover:bg-white/20 border border-white/10'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied' : 'Copy Prompt'}
            </button>
            <button 
                onClick={handleLike}
                className={`p-2 rounded-lg transition-colors flex items-center gap-1.5 ${
                    isLiked 
                    ? 'bg-pink-500/20 text-pink-500' 
                    : 'bg-white/10 text-white hover:bg-pink-500/20 hover:text-pink-500'
                }`}
            >
                <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
                {likes > 0 && <span className="text-xs font-bold">{likes}</span>}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
