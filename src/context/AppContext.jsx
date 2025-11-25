import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};

export const AppProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved ? JSON.parse(saved) : false;
  });
  
  const [searchQuery, setSearchQuery] = useState('');
  const [user, setUser] = useState(null);
  const [subscribedChannels, setSubscribedChannels] = useState(() => {
    const saved = localStorage.getItem('subscribedChannels');
    return saved ? JSON.parse(saved) : [];
  });
  const [watchHistory, setWatchHistory] = useState(() => {
    const saved = localStorage.getItem('watchHistory');
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem('darkMode', JSON.stringify(darkMode));
    if (document.documentElement) {
      document.documentElement.setAttribute('data-theme', darkMode ? 'dark' : 'light');
    }
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem('subscribedChannels', JSON.stringify(subscribedChannels));
  }, [subscribedChannels]);

  useEffect(() => {
    localStorage.setItem('watchHistory', JSON.stringify(watchHistory));
  }, [watchHistory]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  const addToHistory = (video) => {
    setWatchHistory(prev => {
      const filtered = prev.filter(item => item.id !== video.id);
      return [{ ...video, watchedAt: new Date().toISOString() }, ...filtered].slice(0, 50);
    });
  };

  const subscribeToChannel = (channelId, channelInfo) => {
    setSubscribedChannels(prev => {
      if (prev.find(sub => sub.id === channelId)) {
        return prev.filter(sub => sub.id !== channelId);
      }
      return [...prev, { id: channelId, ...channelInfo }];
    });
  };

  const isSubscribed = (channelId) => {
    return subscribedChannels.some(sub => sub.id === channelId);
  };

  const value = {
    darkMode,
    toggleDarkMode,
    searchQuery,
    setSearchQuery,
    user,
    setUser,
    subscribedChannels,
    subscribeToChannel,
    isSubscribed,
    watchHistory,
    addToHistory,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

