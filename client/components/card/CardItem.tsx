'use client';

import { Card } from '@/types';
import { format } from 'date-fns';

interface CardItemProps {
  card: Card;
  onClick?: () => void;
  dragHandleProps?: any;
}

export function CardItem({ card, onClick, dragHandleProps }: CardItemProps) {
  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'label-high';
      case 'MEDIUM':
        return 'label-medium';
      case 'LOW':
        return 'label-low';
      default:
        return 'label-medium';
    }
  };

  return (
    <div className="card group relative hover:shadow-md transition-shadow bg-white">
      {/* Drag Handle */}
      <div
        {...dragHandleProps}
        className="absolute left-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        title="Drag to move"
      >
        <svg
          className="w-4 h-4 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 8h16M4 16h16"
          />
        </svg>
      </div>

      {/* Edit Button */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onClick?.();
        }}
        className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-100 rounded"
        title="Edit card"
      >
        <svg
          className="w-4 h-4 text-gray-600"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
          />
        </svg>
      </button>

      {/* Card Content */}
      <div onClick={onClick} className="cursor-pointer">
        <h4 className="font-medium text-gray-900 mb-2 pr-6">{card.title}</h4>

      {card.description && (
        <p className="text-sm text-gray-600 mb-2 line-clamp-2">{card.description}</p>
      )}

      <div className="flex flex-wrap gap-1 mb-2">
        {card.labels.map((label, index) => (
          <span key={index} className="label bg-blue-100 text-blue-800">
            {label}
          </span>
        ))}
        <span className={`label ${getPriorityColor(card.priority)}`}>
          {card.priority}
        </span>
      </div>

        <div className="flex items-center justify-between text-xs text-gray-500">
          {card.dueDate && (
            <span>
              Due: {format(new Date(card.dueDate), 'MMM d')}
            </span>
          )}
          {card.assignees.length > 0 && (
            <div className="flex -space-x-1">
              {card.assignees.slice(0, 3).map((assignee) => (
                <div
                  key={assignee.id}
                  className="w-6 h-6 rounded-full bg-primary-500 text-white flex items-center justify-center text-xs border-2 border-white"
                  title={assignee.name}
                >
                  {assignee.name.charAt(0).toUpperCase()}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
