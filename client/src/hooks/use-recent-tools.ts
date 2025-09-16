import { useState, useEffect, useCallback } from 'react';
import { Tool, getToolById } from '@/lib/tools-data';

const RECENT_TOOLS_KEY = 'altaf-recent-tools';
const MAX_RECENT_TOOLS = 5;

export interface RecentToolEntry {
  toolId: string;
  timestamp: number;
}

export function useRecentTools() {
  const [recentTools, setRecentTools] = useState<Tool[]>([]);

  // Load recent tools from localStorage on mount
  useEffect(() => {
    const loadRecentTools = () => {
      try {
        const stored = localStorage.getItem(RECENT_TOOLS_KEY);
        if (stored) {
          const entries: RecentToolEntry[] = JSON.parse(stored);
          // Convert tool IDs to Tool objects
          const tools = entries
            .map(entry => getToolById(entry.toolId))
            .filter((tool): tool is Tool => tool !== undefined && tool.available);
          setRecentTools(tools);
        }
      } catch (error) {
        console.error('Error loading recent tools:', error);
      }
    };

    loadRecentTools();
    
    // Listen for storage changes from other tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === RECENT_TOOLS_KEY) {
        loadRecentTools();
      }
    };

    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  // Add a tool to recent list
  const addRecentTool = useCallback((toolId: string) => {
    try {
      const storedStr = localStorage.getItem(RECENT_TOOLS_KEY);
      let entries: RecentToolEntry[] = storedStr ? JSON.parse(storedStr) : [];
      
      // Remove if already exists
      entries = entries.filter(e => e.toolId !== toolId);
      
      // Add to beginning
      entries.unshift({
        toolId,
        timestamp: Date.now()
      });
      
      // Keep only the most recent entries
      entries = entries.slice(0, MAX_RECENT_TOOLS);
      
      // Save to localStorage
      localStorage.setItem(RECENT_TOOLS_KEY, JSON.stringify(entries));
      
      // Update state
      const tools = entries
        .map(entry => getToolById(entry.toolId))
        .filter((tool): tool is Tool => tool !== undefined && tool.available);
      setRecentTools(tools);
    } catch (error) {
      console.error('Error adding recent tool:', error);
    }
  }, []);

  // Clear recent tools
  const clearRecentTools = useCallback(() => {
    try {
      localStorage.removeItem(RECENT_TOOLS_KEY);
      setRecentTools([]);
    } catch (error) {
      console.error('Error clearing recent tools:', error);
    }
  }, []);

  return {
    recentTools,
    addRecentTool,
    clearRecentTools,
    hasRecentTools: recentTools.length > 0
  };
}