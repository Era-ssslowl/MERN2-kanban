'use client';

import { useState, useEffect, useRef } from 'react';
import { useLazyQuery, gql } from '@apollo/client';
import { useRouter } from 'next/navigation';

const SEARCH_QUERY = gql`
  query Search($query: String!) {
    search(query: $query) {
      boards {
        id
        title
        description
        backgroundColor
      }
      cards {
        id
        title
        description
        labels
        priority
        list {
          id
          title
          board {
            id
            title
          }
        }
      }
    }
  }
`;

interface Board {
  id: string;
  title: string;
  description: string;
  backgroundColor: string;
}

interface Card {
  id: string;
  title: string;
  description: string;
  labels: string[];
  priority: string;
  list: {
    id: string;
    title: string;
    board: {
      id: string;
      title: string;
    };
  };
}

export function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  const [search, { data, loading }] = useLazyQuery(SEARCH_QUERY);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (query.length >= 2) {
      const debounce = setTimeout(() => {
        search({ variables: { query } });
        setIsOpen(true);
      }, 300);

      return () => clearTimeout(debounce);
    } else {
      setIsOpen(false);
    }
  }, [query, search]);

  const boards: Board[] = data?.search?.boards || [];
  const cards: Card[] = data?.search?.cards || [];

  const handleBoardClick = (boardId: string) => {
    router.push(`/board/${boardId}`);
    setIsOpen(false);
    setQuery('');
  };

  const handleCardClick = (card: Card) => {
    router.push(`/board/${card.list.board.id}`);
    setIsOpen(false);
    setQuery('');
  };

  const getPriorityColor = (priority: string) => {
    switch (priority.toLowerCase()) {
      case 'high':
        return 'text-red-600 bg-red-100';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100';
      case 'low':
        return 'text-green-600 bg-green-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  return (
    <div ref={searchRef} className="relative w-full max-w-xl">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search boards and cards..."
          className="w-full px-4 py-2 pl-10 pr-4 text-gray-700 bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
        />
        <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
          <svg
            className="w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </div>
        {loading && (
          <div className="absolute inset-y-0 right-0 flex items-center pr-3">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-500"></div>
          </div>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && query.length >= 2 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-lg shadow-xl border border-gray-200 max-h-96 overflow-y-auto">
          {boards.length === 0 && cards.length === 0 && !loading && (
            <div className="px-4 py-8 text-center text-gray-500">
              No results found for "{query}"
            </div>
          )}

          {/* Boards Section */}
          {boards.length > 0 && (
            <div className="px-4 py-2 border-b border-gray-200">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Boards ({boards.length})
              </h3>
              <div className="space-y-1">
                {boards.map((board) => (
                  <button
                    key={board.id}
                    onClick={() => handleBoardClick(board.id)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition"
                  >
                    <div className="flex items-center space-x-3">
                      <div
                        className="w-10 h-8 rounded flex-shrink-0"
                        style={{ backgroundColor: board.backgroundColor }}
                      ></div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {board.title}
                        </p>
                        {board.description && (
                          <p className="text-xs text-gray-500 truncate">{board.description}</p>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Cards Section */}
          {cards.length > 0 && (
            <div className="px-4 py-2">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">
                Cards ({cards.length})
              </h3>
              <div className="space-y-1">
                {cards.map((card) => (
                  <button
                    key={card.id}
                    onClick={() => handleCardClick(card)}
                    className="w-full text-left px-3 py-2 rounded-md hover:bg-gray-100 transition"
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">{card.title}</p>
                        <p className="text-xs text-gray-500 mt-1">
                          in {card.list.board.title} / {card.list.title}
                        </p>
                        {card.description && (
                          <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                            {card.description}
                          </p>
                        )}
                        <div className="flex items-center space-x-2 mt-2">
                          <span
                            className={`px-2 py-0.5 text-xs font-medium rounded ${getPriorityColor(
                              card.priority
                            )}`}
                          >
                            {card.priority}
                          </span>
                          {card.labels.length > 0 && (
                            <div className="flex items-center space-x-1">
                              {card.labels.slice(0, 3).map((label, index) => (
                                <span
                                  key={index}
                                  className="px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded"
                                >
                                  {label}
                                </span>
                              ))}
                              {card.labels.length > 3 && (
                                <span className="text-xs text-gray-500">
                                  +{card.labels.length - 3}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
