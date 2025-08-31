import { useEffect, useState } from 'react';

interface ViewCounts {
  [recipeId: string]: number;
}

const STORAGE_KEY = 'recipe-view-counts';

export const useViewCounter = () => {
  const [viewCounts, setViewCounts] = useState<ViewCounts>(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    return stored ? JSON.parse(stored) : {};
  });

  const incrementView = (recipeId: string) => {
    setViewCounts(prev => {
      const newCounts = {
        ...prev,
        [recipeId]: (prev[recipeId] || 0) + 1
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newCounts));
      return newCounts;
    });
  };

  const getViewCount = (recipeId: string): number => {
    return viewCounts[recipeId] || 0;
  };

  return { incrementView, getViewCount, viewCounts };
};