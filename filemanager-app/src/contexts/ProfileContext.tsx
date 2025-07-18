import React, { createContext, useContext, useEffect, useState } from 'react';

type Profile = { username: string };

const ProfileContext = createContext<{
  profile: Profile | null;
  isLoading: boolean;
}>({
  profile: null,
  isLoading: true,
});

export const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:8000/api/auth/profile/', {
      credentials: 'include',
    })
      .then((res) => {
        if (!res.ok) return null;
        return res.json();
      })
      .then((data) => {
        setProfile(data);
        setIsLoading(false);
      })
      .catch(() => {
        setProfile(null);
        setIsLoading(false);
      });
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, isLoading }}>
      {children}
    </ProfileContext.Provider>
  );
};

export const useProfile = () => useContext(ProfileContext);
