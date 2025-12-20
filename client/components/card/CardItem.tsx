'use client';

import { Card } from '@/types';
import { format } from 'date-fns';

interface CardItemProps {
  card: Card;
}

export function CardItem({ card }: CardItemProps) {
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
    <div className="card cursor-pointer hover:shadow-md transition-shadow">
      <h4 className="font-medium text-gray-900 mb-2">{card.title}</h4>

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
  );
}
