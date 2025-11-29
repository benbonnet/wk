import { useState, useEffect } from "react";
import { getCurrentUser } from "../api/auth";
import type User from "../types/api/User";

type UserData = User["user"];

interface UseAuthReturn {
  user: UserData | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

export function useAuth(): UseAuthReturn {
  const [user, setUser] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCurrentUser()
      .then((userData) => {
        setUser(userData);
      })
      .catch(() => {
        setUser(null);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, []);

  return {
    user,
    isLoading,
    isAuthenticated: user !== null,
  };
}
