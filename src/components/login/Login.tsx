import { Route, Routes } from "react-router-dom";
import React from "react";
import LoginForm from "./LoginForm";
import LoginEsqueciSenha from "./LoginEsqueciSenha";
import LoginResetar from "./LoginResetar";
import LoginCreate from "./LoginCreate";

const Login: React.FC = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="esqueci" element={<LoginEsqueciSenha />} />
        <Route path="resetar" element={<LoginResetar />} />
        <Route path="create" element={<LoginCreate />} />
      </Routes>
    </div>
  );
};

export default Login;
