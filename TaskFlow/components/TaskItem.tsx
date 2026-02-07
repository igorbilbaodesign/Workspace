import React, { useRef, useEffect } from 'react';
import { Task } from '../types';
import { Trash2, Edit2, Check, X, Tag } from 'lucide-react';

interface TaskItemProps {
  task: Task;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  onEdit: (id: string, newText: string) => void;
  onToggleEdit: (id: string) => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, onToggle, onDelete, onEdit, onToggleEdit }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (task.isEditing && inputRef.current) inputRef.current.focus();
  }, [task.isEditing]);

  const priorityColor = {
    high: 'bg-red-500',
    medium: 'bg-amber-500',
    low: 'bg-blue-500'
  };

  return (
    <div className={`
      group relative flex items-stretch overflow-hidden rounded-xl border transition-all duration-300
      ${task.completed 
        ? 'bg-gray-300 dark:bg-[#0a0a0a] border-transparent opacity-60' 
        : 'bg-[#f4f4f5] dark:bg-[#111] border-gray-400 dark:border-[#222] hover:border-gray-500 dark:hover:border-[#444] shadow-sm hover:shadow-md hover:-translate-y-[1px]'
      }
    `}>
      
      {/* Priority Indicator Strip */}
      <div className={`w-1 ${priorityColor[task.priority]} flex-shrink-0`} />

      {/* Main Content */}
      <div className="flex-1 flex items-center p-4 gap-4 min-w-0">
        
        {/* Checkbox (Custom) */}
        <button 
          onClick={() => onToggle(task.id)}
          className={`w-5 h-5 rounded border flex items-center justify-center transition-colors
            ${task.completed 
              ? 'bg-gray-600 dark:bg-gray-600 border-transparent text-white' 
              : 'border-gray-500 dark:border-gray-600 hover:border-blue-600 dark:hover:border-blue-500 bg-white/50 dark:bg-transparent'
            }`}
        >
          {task.completed && <Check size={12} strokeWidth={4} />}
        </button>

        {/* Text Area */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          {task.isEditing ? (
            <input
              ref={inputRef}
              defaultValue={task.text}
              className="w-full bg-transparent border-b border-blue-500 outline-none font-medium text-black dark:text-gray-100 pb-1"
              onKeyDown={(e) => {
                if (e.key === 'Enter') onEdit(task.id, e.currentTarget.value);
                if (e.key === 'Escape') onToggleEdit(task.id);
              }}
            />
          ) : (
            <>
              <span className={`font-medium text-[15px] truncate ${task.completed ? 'line-through text-gray-600 dark:text-gray-500' : 'text-gray-900 dark:text-gray-100'}`}>
                {task.text}
              </span>
              
              {/* Meta Row */}
              <div className="flex items-center gap-3 mt-1.5">
                <span className="text-[10px] font-mono font-bold text-gray-600 dark:text-gray-400 uppercase tracking-wider">{task.priority}</span>
                {task.tags?.length > 0 && (
                  <div className="flex gap-1">
                    {task.tags.map(t => (
                      <span key={t} className="text-[10px] bg-gray-200 dark:bg-[#222] text-gray-700 dark:text-gray-500 px-1.5 py-0.5 rounded flex items-center font-medium border border-gray-300 dark:border-transparent">
                        <Tag size={8} className="mr-1"/>{t}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>

      {/* Hover Actions (Desktop) */}
      <div className={`hidden group-hover:flex items-center gap-1 pr-3 pl-4 bg-gradient-to-l to-transparent
        ${task.completed ? 'from-gray-300 via-gray-300' : 'from-[#f4f4f5] via-[#f4f4f5] dark:from-[#111] dark:via-[#111]'}
      `}>
        <button onClick={() => onToggleEdit(task.id)} className="p-2 text-gray-600 dark:text-gray-400 hover:text-blue-600"><Edit2 size={16}/></button>
        <button onClick={() => onDelete(task.id)} className="p-2 text-gray-600 dark:text-gray-400 hover:text-red-600"><Trash2 size={16}/></button>
      </div>

      {/* Always visible delete on mobile */}
      <div className="sm:hidden flex items-center pr-3">
         <button onClick={() => onDelete(task.id)} className="p-2 text-gray-500 dark:text-gray-600"><Trash2 size={16}/></button>
      </div>
      
    </div>
  );
};

export default TaskItem;