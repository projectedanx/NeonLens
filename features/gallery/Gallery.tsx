import React, { useEffect, useState, useMemo } from 'react';
import { Image, FilterState } from '../../types';
import { MockService } from '../../services/mockService';
import { ImageCard } from './ImageCard';
import { Filter, Search } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterState>({
    style: '',
    engine: '',
    category: ''
  });

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const data = await MockService.getImages();
      setImages(data);
      setLoading(false);
    };
    loadImages();
  }, []);

  const filteredImages = useMemo(() => {
    return images.filter(img => {
      const matchesSearch = img.prompt.toLowerCase().includes(searchTerm.toLowerCase()) || 
                            img.style.some(s => s.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStyle = filters.style ? img.style.includes(filters.style) : true;
      const matchesEngine = filters.engine ? img.engine === filters.engine : true;
      const matchesCategory = filters.category ? img.category.includes(filters.category) : true;

      return matchesSearch && matchesStyle && matchesEngine && matchesCategory;
    });
  }, [images, searchTerm, filters]);

  // Extract unique options for filters
  const styles = Array.from(new Set(images.flatMap(i => i.style)));
  const engines = Array.from(new Set(images.map(i => i.engine)));
  const categories = Array.from(new Set(images.flatMap(i => i.category)));

  return (
    <div className="animate-fade-in">
      {/* Header Section */}
      <div className="mb-10 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-display font-bold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-500">
          Explore the Hive Mind
        </h1>
        <p className="text-textMuted text-lg">
          Discover cutting-edge AI art and the prompts that engineered them.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="mb-8 sticky top-20 z-40">
        <div className="bg-surface/80 backdrop-blur-xl border border-border p-4 rounded-xl shadow-2xl flex flex-col md:flex-row gap-4 items-center">
          
          <div className="relative w-full md:w-auto md:flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-textMuted h-4 w-4" />
            <input 
              type="text" 
              placeholder="Search prompts, styles..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-surfaceHighlight border border-border rounded-lg pl-9 pr-4 py-2 text-sm focus:ring-1 focus:ring-primary focus:outline-none text-textMain placeholder-textMuted"
            />
          </div>

          <div className="flex gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 no-scrollbar">
            <select 
              className="bg-surfaceHighlight border border-border rounded-lg px-3 py-2 text-sm text-textMuted focus:ring-primary focus:border-primary outline-none"
              value={filters.style}
              onChange={(e) => setFilters(prev => ({ ...prev, style: e.target.value }))}
            >
              <option value="">All Styles</option>
              {styles.map(s => <option key={s} value={s}>{s}</option>)}
            </select>

            <select 
              className="bg-surfaceHighlight border border-border rounded-lg px-3 py-2 text-sm text-textMuted focus:ring-primary focus:border-primary outline-none"
              value={filters.engine}
              onChange={(e) => setFilters(prev => ({ ...prev, engine: e.target.value }))}
            >
              <option value="">All Engines</option>
              {engines.map(e => <option key={e} value={e}>{e}</option>)}
            </select>

            <select 
              className="bg-surfaceHighlight border border-border rounded-lg px-3 py-2 text-sm text-textMuted focus:ring-primary focus:border-primary outline-none"
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value }))}
            >
              <option value="">All Categories</option>
              {categories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            
            {(filters.style || filters.engine || filters.category || searchTerm) && (
              <button 
                onClick={() => {
                  setFilters({ style: '', engine: '', category: '' });
                  setSearchTerm('');
                }}
                className="text-xs text-secondary hover:text-white underline px-2"
              >
                Clear
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Grid */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-surfaceHighlight rounded-xl animate-pulse"></div>
          ))}
        </div>
      ) : filteredImages.length > 0 ? (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-4 gap-6 space-y-6">
          {filteredImages.map((image) => (
            <ImageCard key={image.id} image={image} />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 border border-dashed border-border rounded-xl">
          <Filter className="h-12 w-12 text-textMuted mx-auto mb-4" />
          <h3 className="text-xl font-medium text-textMain">No signals found</h3>
          <p className="text-textMuted">Try adjusting your filters or search terms.</p>
        </div>
      )}
    </div>
  );
};
