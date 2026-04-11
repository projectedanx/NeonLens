import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { MockService } from '../../services/mockService';
import { Button } from '../../components/ui/Button';
import { Input, TextArea } from '../../components/ui/Input';
import { Upload, Image as ImageIcon, X } from 'lucide-react';

export const UploadForm: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    prompt: '',
    engine: 'Midjourney',
    style: '',
    category: ''
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !user) return;

    setLoading(true);
    try {
      await MockService.uploadImage(file, {
        prompt: formData.prompt,
        engine: formData.engine,
        style: formData.style.split(',').map(s => s.trim()).filter(Boolean),
        category: formData.category.split(',').map(s => s.trim()).filter(Boolean),
        userId: user.uid,
      }, user);
      navigate('/profile');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-8 animate-fade-in">
      <h1 className="text-3xl font-display font-bold mb-8">Upload Artifact</h1>
      
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* File Drop Area (Simulated) */}
        <div className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${file ? 'border-primary bg-primary/5' : 'border-border hover:border-textMuted bg-surface'}`}>
          <input 
            type="file" 
            accept="image/*" 
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            required
          />
          
          {preview ? (
            <div className="relative inline-block group">
              <img src={preview} alt="Preview" className="max-h-64 rounded-lg shadow-lg" />
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center rounded-lg">
                <span className="text-white font-medium">Click to change</span>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8">
              <div className="w-16 h-16 rounded-full bg-surfaceHighlight flex items-center justify-center mb-4">
                <Upload className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-medium mb-1">Drop your image here</h3>
              <p className="text-textMuted text-sm">Supports JPG, PNG (Max 5MB)</p>
            </div>
          )}
        </div>

        {/* Metadata Fields */}
        <div className="grid gap-6 bg-surface border border-border p-6 rounded-xl">
          <TextArea 
            label="Prompt" 
            placeholder="What magic words created this image?"
            value={formData.prompt}
            onChange={(e) => setFormData(prev => ({ ...prev, prompt: e.target.value }))}
            required
            className="font-mono text-sm"
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-textMuted mb-1.5">AI Engine</label>
              <select 
                value={formData.engine}
                onChange={(e) => setFormData(prev => ({ ...prev, engine: e.target.value }))}
                className="w-full bg-surfaceHighlight border border-border rounded-md px-4 py-2.5 text-textMain focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="Midjourney">Midjourney</option>
                <option value="DALL-E 3">DALL-E 3</option>
                <option value="Stable Diffusion">Stable Diffusion</option>
                <option value="Leonardo AI">Leonardo AI</option>
              </select>
            </div>

            <Input 
              label="Style Tags (comma separated)" 
              placeholder="e.g. Cyberpunk, Noir, 3D"
              value={formData.style}
              onChange={(e) => setFormData(prev => ({ ...prev, style: e.target.value }))}
            />

            <Input 
              label="Category (comma separated)" 
              placeholder="e.g. Character, Landscape"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
            />
          </div>
        </div>

        <div className="flex justify-end gap-4">
          <Button type="button" variant="ghost" onClick={() => navigate(-1)}>Cancel</Button>
          <Button type="submit" isLoading={loading} disabled={!file || !formData.prompt}>
            Publish to Grid
          </Button>
        </div>
      </form>
    </div>
  );
};
