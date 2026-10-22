import { createContext, useContext, useEffect, useState, useCallback } from "react";
import { profileApi } from "../api/profile.api.js";
import { useAuth } from "./AuthContext.jsx";

const ProfileContext = createContext(null);

export function ProfileProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProfile = useCallback(async () => {
    if (!isAuthenticated) return;
    setLoading(true);
    setError(null);
    try {
      const res = await profileApi.get();
      setProfile(res.data.data.profile);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  const saveProfile = useCallback(async (payload) => {
    const res = await profileApi.save(payload);
    setProfile(res.data.data.profile);
    return res.data.data.profile;
  }, []);

  const confirmProfile = useCallback(async () => {
    const res = await profileApi.confirm();
    setProfile(res.data.data.profile);
    return res.data.data.profile;
  }, []);

  return (
    <ProfileContext.Provider value={{ profile, loading, error, fetchProfile, saveProfile, confirmProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfile must be used inside <ProfileProvider>");
  return ctx;
}