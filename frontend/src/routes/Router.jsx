import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import CadastroPet from "../pages/CadastroPet";
import RecuperarSenha from "../pages/RecuperarSenha";
import Cadastro from "../pages/Cadastro"; // Importando a página de Cadastro
import RedefinirSenha from "../pages/RedefinirSenha";

function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />; // Redireciona para Login caso não haja token
  }

  return children; // Caso contrário, renderiza o componente filho
}

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        {/* Rota para editar pet, com um parâmetro de pet_id */}
        <Route
          path="/cadastro-pet/:pet_id"
          element={
            <ProtectedRoute>
              <CadastroPet />
            </ProtectedRoute>
          }
        />
        {/* Rota para cadastro de pet quando o pet_id não for fornecido */}
        <Route
          path="/cadastro-pet/"
          element={
            <ProtectedRoute>
              <CadastroPet />
            </ProtectedRoute>
          }
        />
        <Route 
          path="/esqueci-senha" 
          element={<RecuperarSenha />} 
        />
        <Route 
          path="/cadastro" 
          element={<Cadastro />} 
        /> {/* Adicionando a rota de cadastro */}
        <Route 
          path="/redefinir-senha/:token" 
          element={<RedefinirSenha />} 
        />
      </Routes>
    </BrowserRouter>
  );
}
