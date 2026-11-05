import React, { useState } from "react";
import { UserContext, type UserProfile } from "./UserContext";

const DEFAULT_USER: UserProfile = {
  name: "Ana Souza",
  email: "ana.souza@nexo.com.br",
  role: "colaborador",
  department: "Financeiro"
};

const USER_STORAGE_KEY = "nexo_current_logged_user";

export const UserStorage = ({ children }: { children: React.ReactNode }) => {
  const [currentUser, setCurrentUser] = useState<UserProfile>(() => {
    const saved = localStorage.getItem(USER_STORAGE_KEY);
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return DEFAULT_USER;
      }
    }
    return DEFAULT_USER;
  });

  const setUser = (user: UserProfile) => {
    setCurrentUser(user);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  };

  const logout = () => {
    localStorage.removeItem(USER_STORAGE_KEY);
  };

  return (
    <UserContext.Provider
      value={{
        usuario: currentUser.name,
        currentUser,
        setUser,
        logout
      }}
    >
      {children}
    </UserContext.Provider>
  );
};
