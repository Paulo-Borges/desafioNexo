import React from "react";

export interface UserProfile {
  name: string;
  email: string;
  role: "colaborador" | "analista";
  department: string;
}

export interface UserContextType {
  usuario: string | null;
  currentUser: UserProfile;
  setUser: (user: UserProfile) => void;
  logout: () => void;
}

export const UserContext = React.createContext<UserContextType | null>(null);
