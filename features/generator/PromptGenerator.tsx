import React, { useState, useEffect } from 'react';
import { MockService } from '../../services/mockService';
import { PromptTemplate } from '../../types';
import { Button } from '../../components/ui/Button';
import { Copy, RefreshCw, Wand2, Check } from 'lucide-react';

export const PromptGenerator: React.FC = () => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState<PromptTemplate | null>(null);
  const [generatedPrompt, setGeneratedPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);

  // Word banks for randomization
  const adjectives = ['ethereal', 'gritty', 'luminescent', 'ancient', 'futuristic', 'haunted', 'crystalline', 'monolithic'];
  const nouns = ['cyborg', 'temple', 'forest', 'mecha', 'astronaut', 'ruins', 'ocean', 'cityscape'];
  const lightings = ['volumetric', 'cinematic', 'neon', 'natural', 'studio', 'bioluminescent'];
  const colors = ['cyan', 'magenta', 'amber', 'obsidian', 'pastel', 'vibrant'];

  useEffect(() => {
    MockService.getTemplates().then(data => {
      setTemplates(data);
      if (data.length > 0) setSelectedTemplate(data[0]);
    });
  }, []);

  const getRandom = (arr: string[]) => arr[Math.floor(Math.random() * arr.length)];

  const generate = () => {
    if (!selectedTemplate) return;
    setIsGenerating(true);
    
    // Simulate thinking time
    setTimeout(() => {
      let result = selectedTemplate.template;
      // Simple regex replacement for placeholders like {adjective}
      result = result.replace(/{adjective}/g, () => getRandom(adjectives));
      result = result.replace(/{noun}/g, () => getRandom(nouns));
      result = result.replace(/{lighting}/g, () => getRandom(lightings));
      result = result.replace(/{color}/g, () => getRandom(colors));
      
      setGeneratedPrompt(result);
      setIsGenerating(false);
      setCopied(false);
    }, 600);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="max-w-4xl mx-auto py-12 animate-fade-in">
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center p-3 bg-secondary/10 rounded-full mb-4">
          <Wand2 className="h-8 w-8 text-secondary" />
        </div>
        <h1 className="text-4xl font-display font-bold mb-4">Prompt Engineer</h1>
        <p className="text-textMuted max-w-xl mx-auto">
          Break creative block with our deterministic prompt synthesizer. Select a template and randomize parameters.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Sidebar: Template Selection */}
        <div className="space-y-4">
          <h3 className="text-sm font-medium text-textMuted uppercase tracking-wider">Templates</h3>
          <div className="flex flex-col gap-2">
            {templates.map(t => (
              <button
                key={t.id}
                onClick={() => setSelectedTemplate(t)}
                className={`text-left px-4 py-3 rounded-lg border transition-all ${
                  selectedTemplate?.id === t.id 
                    ? 'bg-surfaceHighlight border-primary text-white shadow-lg' 
                    : 'bg-surface border-border text-textMuted hover:border-gray-600'
                }`}
              >
                <div className="font-medium text-sm">{t.name}</div>
                <div className="text-xs opacity-60 mt-1">{t.category}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Main: Generator Output */}
        <div className="md:col-span-2">
          <div className="bg-surface border border-border rounded-xl p-6 md:p-8 h-full flex flex-col">
            <div className="flex-1 mb-8">
              <label className="block text-sm font-medium text-textMuted mb-2">Base Template</label>
              <div className="p-4 bg-background rounded-lg border border-border text-textMuted text-sm font-mono mb-6 opacity-70">
                {selectedTemplate?.template || "Select a template..."}
              </div>

              <label className="block text-sm font-medium text-textMuted mb-2">Generated Result</label>
              <div className={`relative p-6 bg-black/40 rounded-xl border border-border min-h-[140px] flex items-center justify-center text-center transition-all ${isGenerating ? 'animate-pulse' : ''}`}>
                {generatedPrompt ? (
                  <p className="text-lg md:text-xl font-medium text-transparent bg-clip-text bg-gradient-to-r from-primary via-white to-secondary leading-relaxed">
                    "{generatedPrompt}"
                  </p>
                ) : (
                  <p className="text-textMuted italic">Ready to synthesize...</p>
                )}
                
                {generatedPrompt && (
                  <button 
                    onClick={copyToClipboard}
                    className="absolute bottom-3 right-3 p-2 rounded-md bg-white/5 hover:bg-white/10 text-textMuted hover:text-white transition-colors"
                    title="Copy to clipboard"
                  >
                    {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
                  </button>
                )}
              </div>
            </div>

            <Button 
              size="lg" 
              onClick={generate} 
              disabled={isGenerating || !selectedTemplate}
              className="w-full relative overflow-hidden group"
            >
               <span className="relative z-10 flex items-center gap-2">
                 <RefreshCw className={`w-5 h-5 ${isGenerating ? 'animate-spin' : ''}`} />
                 {generatedPrompt ? 'Regenerate' : 'Generate Prompt'}
               </span>
               <div className="absolute inset-0 bg-gradient-to-r from-primary to-secondary opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
