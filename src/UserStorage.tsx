import React from "react";
import { UserContext } from "./UserContext"; // Importa do arquivo criado acima

export const UserStorage = ({ children }: { children: React.ReactNode }) => {
  return (
    <UserContext.Provider value={{ usuario: "Borges" }}>
      {children}
    </UserContext.Provider>
  );
};
