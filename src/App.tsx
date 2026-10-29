import { BrowserRouter, Route, Routes } from "react-router-dom";
import Chat from "./pages/Chat";
import Atendente from "./pages/Atendente";
import Login from "./components/login/Login";
import Home from "./pages/Home";

function App() {
  return (
    <div className="justify-center flex flex-col items-center">
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/chat" element={<Chat />} />
          <Route path="/atendente" element={<Atendente />} />
          <Route path="/login/*" element={<Login />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}

export default App;
