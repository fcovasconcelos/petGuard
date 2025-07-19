import { useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { validarSenha } from "../utils/validacoes";

export default function RedefinirSenha() {
  const { token } = useParams(); // Obtém o token da URL
  const [novaSenha, setNovaSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  const handleRedefinicao = async (e) => {
    e.preventDefault();

    // Valida se as senhas são iguais
    if (novaSenha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      setSucesso("");
      return;
    }

    if (!validarSenha(novaSenha)) {
      setErro("A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/redefinir-senha", {
        novaSenha,
        token,
      });
      setSucesso("Senha redefinida com sucesso!");
      setErro("");
      setTimeout(() => {
        navigate("/"); // Redireciona para a página de Login após 2 segundos
      }, 2000);
    } catch (err) {
      setErro("Erro ao redefinir a senha. Tente novamente.");
      setSucesso("");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
          Redefinir Senha
        </h2>

        {/* Exibe a mensagem de erro */}
        {erro && (
          <p className="text-red-600 text-sm mb-4 text-center">{erro}</p>
        )}

        {/* Exibe a mensagem de sucesso */}
        {sucesso && (
          <p className="text-green-600 text-sm mb-4 text-center">{sucesso}</p>
        )}

        <input
          type="password"
          placeholder="Nova senha"
          value={novaSenha}
          onChange={(e) => setNovaSenha(e.target.value)}
          required
          className="w-full px-3 py-2 mb-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
        />

        <input
          type="password"
          placeholder="Confirmar senha"
          value={confirmarSenha}
          onChange={(e) => setConfirmarSenha(e.target.value)}
          required
          className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
        />

        <button
          onClick={handleRedefinicao}
          className="w-full bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2 rounded-md transition"
        >
          Redefinir Senha
        </button>
      </div>
    </div>
  );
}
