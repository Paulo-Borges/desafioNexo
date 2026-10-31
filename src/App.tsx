import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat";
import Atendente from "./pages/Atendente";
import Login from "./components/login/Login";
import Home from "./pages/Home";
import { UserStorage } from "./UserStorage";
import ChatClientLayout from "./components/chatClientLayout";
import AtendenteLayout from "./components/AtendenteLayout";
import Perfil from "./pages/Perfil";

function App() {
  return (
    <div className="justify-center flex flex-col items-center">
      <BrowserRouter>
        <UserStorage>
          <Routes>
            <Route element={<ChatClientLayout />}>
              <Route path="/chat" element={<Chat />} />
              <Route path="/perfil" element={<Perfil />} />
            </Route>

            <Route element={<AtendenteLayout />}>
              <Route path="/atendente" element={<Atendente />} />
            </Route>

            <Route path="/" element={<Home />} />
            <Route path="/login/*" element={<Login />} />
          </Routes>
        </UserStorage>
      </BrowserRouter>
    </div>
  );
}

export default App;
