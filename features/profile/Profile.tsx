import React, { useEffect, useState } from 'react';
import { useAuth } from '../auth/AuthContext';
import { Image } from '../../types';
import { MockService } from '../../services/mockService';
import { ImageCard } from '../gallery/ImageCard';
import { Settings, Grid, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '../../components/ui/Button';

export const Profile: React.FC = () => {
  const { user } = useAuth();
  const [userImages, setUserImages] = useState<Image[]>([]);
  const [likedImages, setLikedImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'uploads' | 'likes'>('uploads');

  useEffect(() => {
    if (user) {
      setLoading(true);
      // Fetch user's uploaded images
      MockService.getUserImages(user.uid).then(imgs => {
        setUserImages(imgs);
        // Also fetch liked images to populate the count and list immediately
        return MockService.getLikedImages(user.uid);
      }).then(liked => {
        setLikedImages(liked);
        setLoading(false);
      });
    }
  }, [user]);

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] gap-4">
        <p className="text-textMuted">Please log in to view your profile.</p>
        <Link to="/"><Button>Go Home</Button></Link>
      </div>
    );
  }

  const displayedImages = activeTab === 'uploads' ? userImages : likedImages;
  const totalReceivedLikes = userImages.reduce((acc, img) => acc + img.likes, 0);

  return (
    <div className="animate-fade-in">
      {/* Profile Header */}
      <div className="bg-surface border border-border rounded-xl p-8 mb-8 flex flex-col md:flex-row items-center gap-8 md:items-start">
        <div className="relative">
          <div className="w-32 h-32 rounded-full p-1 bg-gradient-to-tr from-primary to-secondary">
             <img 
               src={user.photoURL} 
               alt={user.displayName} 
               className="w-full h-full rounded-full object-cover border-4 border-background"
             />
          </div>
        </div>
        
        <div className="flex-1 text-center md:text-left space-y-4">
          <div>
            <h1 className="text-3xl font-display font-bold">{user.displayName}</h1>
            <p className="text-textMuted">{user.email}</p>
          </div>
          <div className="flex gap-6 justify-center md:justify-start text-sm">
            <div className="text-center md:text-left">
              <span className="block font-bold text-lg text-white">{userImages.length}</span>
              <span className="text-textMuted">Artifacts</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block font-bold text-lg text-white">{totalReceivedLikes}</span>
              <span className="text-textMuted">Received Likes</span>
            </div>
            <div className="text-center md:text-left">
              <span className="block font-bold text-lg text-white">{likedImages.length}</span>
              <span className="text-textMuted">Liked</span>
            </div>
          </div>
        </div>

        <div>
          <Button variant="outline" size="sm" className="gap-2">
            <Settings className="w-4 h-4" /> Edit Profile
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-8 border-b border-border mb-8">
        <button 
          onClick={() => setActiveTab('uploads')}
          className={`pb-4 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'uploads' 
            ? 'border-primary text-primary' 
            : 'border-transparent text-textMuted hover:text-white'
          }`}
        >
          <Grid className="w-4 h-4" /> Uploads
        </button>
        <button 
           onClick={() => setActiveTab('likes')}
           className={`pb-4 px-2 font-medium text-sm flex items-center gap-2 border-b-2 transition-colors ${
            activeTab === 'likes' 
            ? 'border-secondary text-secondary' 
            : 'border-transparent text-textMuted hover:text-white'
          }`}
        >
          <Heart className="w-4 h-4" /> Liked ({likedImages.length})
        </button>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
           {[...Array(4)].map((_,i) => <div key={i} className="h-64 bg-surfaceHighlight animate-pulse rounded-xl" />)}
        </div>
      ) : displayedImages.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {displayedImages.map(img => (
            <ImageCard key={img.id} image={img} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12 text-textMuted bg-surface/30 rounded-xl border border-dashed border-border">
          <p>
            {activeTab === 'uploads' 
              ? "No artifacts uploaded yet." 
              : "You haven't liked any artifacts yet."}
          </p>
          {activeTab === 'uploads' ? (
            <Link to="/upload" className="text-primary hover:underline mt-2 inline-block">Upload your first creation</Link>
          ) : (
            <Link to="/" className="text-primary hover:underline mt-2 inline-block">Explore the Gallery</Link>
          )}
        </div>
      )}
    </div>
  );
};
