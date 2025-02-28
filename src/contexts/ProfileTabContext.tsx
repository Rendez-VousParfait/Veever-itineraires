import React, { createContext, useContext, useState } from 'react';

interface ProfileTabContextType {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

const ProfileTabContext = createContext<ProfileTabContextType | undefined>(undefined);

export const ProfileTabProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <ProfileTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </ProfileTabContext.Provider>
  );
};

export const useProfileTab = (): ProfileTabContextType => {
  const context = useContext(ProfileTabContext);
  if (context === undefined) {
    throw new Error('useProfileTab must be used within a ProfileTabProvider');
  }
  return context;
}; 