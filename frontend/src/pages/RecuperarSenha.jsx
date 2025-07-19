import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function RecuperarSenha() {
  const [email, setEmail] = useState("");
  const [erro, setErro] = useState(""); // Estado para exibir erro
  const [sucesso, setSucesso] = useState(""); // Estado para exibir sucesso
  const navigate = useNavigate();

  const handleRecuperacao = async () => {
    try {
      await axios.post("http://localhost:5000/api/auth/recuperar-senha", { email });
      setSucesso("Link de recuperação de senha enviado para o seu e-mail.");
      setErro(""); // Limpar qualquer erro anterior
      setTimeout(() => {
        navigate("/"); // Redireciona para a página de Login após 2 segundos
      }, 2000);
    } catch (err) {
      setErro("Erro ao enviar o e-mail. Verifique o endereço informado.");
      setSucesso(""); // Limpar qualquer sucesso anterior
    }
  };

  return (
    <div className="min-h-screen flex items-start pt-[60px] justify-center bg-gray-100">
      <div className="bg-white rounded-lg shadow-sm p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 text-center mb-4">
          Recuperação de Senha
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
          type="email"
          placeholder="Digite seu e-mail"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 mb-4 text-sm"
        />

        {/* Botões lado a lado */}
        <div className="flex space-x-2">
          <button
            onClick={handleRecuperacao}
            className="w-1/2 bg-teal-600 hover:bg-teal-700 text-white text-sm font-medium py-2 rounded-md transition"
          >
            Enviar
          </button>

          <button
            onClick={() => navigate("/")}
            className="w-1/2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium py-2 rounded-md transition"
          >
            Voltar
          </button>
        </div>
      </div>
    </div>
  );
}
