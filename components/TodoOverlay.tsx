
import React, { useState } from 'react';
import { Todo } from '../types';
import { X, Plus, CheckCircle2, Circle, Trash2 } from 'lucide-react';

interface TodoOverlayProps {
  todos: Todo[];
  onToggle: (id: string) => void;
  onAdd: (text: string) => void;
  onClose: () => void;
}

export const TodoOverlay: React.FC<TodoOverlayProps> = ({ todos, onToggle, onAdd, onClose }) => {
  const [newTodo, setNewTodo] = useState('');

  const handleAdd = () => {
    if (newTodo.trim()) {
      onAdd(newTodo.trim());
      setNewTodo('');
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-[#0f172a] border border-slate-800 rounded-3xl shadow-2xl flex flex-col max-h-[70vh] overflow-hidden">
        <div className="p-6 border-b border-slate-800 flex items-center justify-between">
          <h2 className="text-xl font-bold">Tasks</h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-xl transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4">
          <div className="flex gap-2">
            <input 
              type="text" 
              value={newTodo}
              onChange={(e) => setNewTodo(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
              placeholder="What needs to be done?"
              className="flex-1 bg-slate-800/60 border border-slate-700 rounded-xl px-4 py-2 text-sm focus:border-[#00D9A3] outline-none transition-all"
            />
            <button 
              onClick={handleAdd}
              className="bg-[#00D9A3] text-[#0b1121] p-2 rounded-xl hover:bg-[#00c092] transition-colors"
            >
              <Plus className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 custom-scrollbar">
          {todos.length === 0 ? (
            <div className="text-center py-10 text-slate-500">
              <p className="text-sm">Empty task list.</p>
            </div>
          ) : (
            todos.map(todo => (
              <div key={todo.id} className="flex items-center gap-3 p-3 bg-slate-800/40 rounded-xl group border border-transparent hover:border-slate-700 transition-all">
                <button onClick={() => onToggle(todo.id)} className="text-[#00D9A3]">
                  {todo.completed ? <CheckCircle2 className="w-5 h-5" /> : <Circle className="w-5 h-5" />}
                </button>
                <span className={`flex-1 text-sm ${todo.completed ? 'text-slate-500 line-through' : 'text-white'}`}>
                  {todo.text}
                </span>
                <button className="opacity-0 group-hover:opacity-100 p-1 hover:text-red-400 transition-all">
                   <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
