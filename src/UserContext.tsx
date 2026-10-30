import React from "react";

export interface UserContextType {
  usuario: string | null;
  // adicione outras propriedades aqui se precisar
}

export const UserContext = React.createContext<UserContextType | null>(null);
