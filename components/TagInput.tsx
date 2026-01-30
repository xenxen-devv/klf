
import React, { useState, useRef, useEffect } from 'react';
import { Tag as TagType } from '../types';
import { Search, Tag, X, ChevronDown, Plus, AlertCircle, Settings } from 'lucide-react';

interface TagInputProps {
  allTags: TagType[];
  selectedTags: string[];
  onToggleTag: (name: string) => void;
  onAddTag: (name: string) => TagType;
  onManageTags: (id: string) => void;
}

export const TagInput: React.FC<TagInputProps> = ({ 
  allTags, selectedTags, onToggleTag, onAddTag, onManageTags 
}) => {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const filteredTags = allTags.filter(t => 
    t.name.toLowerCase().includes(query.toLowerCase())
  );

  const similarTag = allTags.find(t => 
    t.name.toLowerCase() === query.toLowerCase() && t.name !== query
  );

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full" ref={containerRef}>
      <div 
        className="flex flex-wrap items-center gap-2 p-2.5 bg-slate-800/60 border border-slate-700 rounded-xl focus-within:border-[#00D9A3] transition-all"
        onClick={() => setIsOpen(true)}
      >
        <div className="flex items-center gap-2 text-slate-500 ml-2">
          <Search className="w-4 h-4" />
        </div>
        
        {selectedTags.map(tagName => (
          <span key={tagName} className="flex items-center gap-1.5 px-2 py-1 bg-emerald-500/10 text-[#00D9A3] border border-emerald-500/20 rounded-md text-sm font-medium animate-in fade-in zoom-in duration-200">
            {tagName}
            <X 
              className="w-3 h-3 cursor-pointer hover:text-white" 
              onClick={(e) => { e.stopPropagation(); onToggleTag(tagName); }} 
            />
          </span>
        ))}

        <input 
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={selectedTags.length === 0 ? "Add a tag..." : ""}
          className="flex-1 min-w-[120px] bg-transparent outline-none text-sm py-1 placeholder:text-slate-500"
          onKeyDown={(e) => {
            if (e.key === 'Enter' && query) {
              const existing = allTags.find(t => t.name.toLowerCase() === query.toLowerCase());
              if (existing) {
                if (!selectedTags.includes(existing.name)) onToggleTag(existing.name);
              } else {
                const newTag = onAddTag(query);
                onToggleTag(newTag.name);
              }
              setQuery('');
            }
          }}
        />
        <ChevronDown className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
      </div>

      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-[#1e293b] border border-slate-700 rounded-xl shadow-2xl z-50 overflow-hidden animate-in slide-in-from-top-2 duration-200">
          <div className="max-h-60 overflow-y-auto custom-scrollbar">
            {filteredTags.length > 0 ? (
              filteredTags.map(tag => (
                <button
                  key={tag.id}
                  onClick={() => {
                    onToggleTag(tag.name);
                    setIsOpen(false);
                    setQuery('');
                  }}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors text-sm text-slate-300"
                >
                  <Tag className="w-4 h-4 text-emerald-500" />
                  <span className="flex-1 text-left">{tag.name}</span>
                  {selectedTags.includes(tag.name) && (
                    <div className="w-1.5 h-1.5 rounded-full bg-[#00D9A3]" />
                  )}
                </button>
              ))
            ) : query && (
              <button
                onClick={() => {
                  const newTag = onAddTag(query);
                  onToggleTag(newTag.name);
                  setQuery('');
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3 px-4 py-3 hover:bg-slate-800 transition-colors text-sm text-[#00D9A3]"
              >
                <Plus className="w-4 h-4" />
                <span>Create tag "{query}"</span>
              </button>
            )}

            {similarTag && (
              <div className="px-4 py-2 bg-amber-500/10 flex items-center gap-2 text-[11px] text-amber-500">
                <AlertCircle className="w-3 h-3" />
                <span>Similar tag '{similarTag.name}' already exists.</span>
              </div>
            )}
          </div>

          <div className="border-t border-slate-700 p-2">
            <button className="w-full flex items-center gap-3 px-2 py-2 hover:bg-slate-800/50 rounded-lg text-xs text-slate-500 transition-colors">
              <Settings className="w-3 h-3" /> Manage Tags
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
