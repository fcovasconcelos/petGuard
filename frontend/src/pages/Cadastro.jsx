import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { validarSenha, validarEmail, formatarTelefone } from "../utils/validacoes";

export default function Cadastro() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");
  const [telefone, setTelefone] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();

    if (!nome || !email || !senha) {
      setErro("Nome, email e senha são obrigatórios.");
      return;
    }

    if (!validarEmail(email)) {
      setErro("Por favor, insira um email válido.");
      return;
    }

    if (!validarSenha(senha)) {
      setErro("A senha deve conter pelo menos uma letra maiúscula, um número e um caractere especial.");
      return;
    }

    if (senha !== confirmarSenha) {
      setErro("As senhas não coincidem.");
      return;
    }

    try {
      await axios.post("http://localhost:5000/api/auth/register", {
        nome,
        email,
        senha,
        telefone: telefone.trim() !== "" ? telefone : null,
      });

      setSucesso("Cadastro realizado com sucesso!");
      setErro("");

      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      if (err.response && err.response.data.erro) {
        setErro(err.response.data.erro);
      } else {
        setErro("Erro no cadastro. Tente novamente.");
      }
    }
  };

  return (
    <div className="min-h-screen flex items-start pt-[60px] justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-semibold text-teal-700 text-center mb-6">Cadastro</h2>

        {erro && <p className="text-red-600 text-sm mb-4 text-center">{erro}</p>}
        {sucesso && <p className="text-green-600 text-sm mb-4 text-center">{sucesso}</p>}

        <form onSubmit={handleCadastro} className="space-y-5">

          {/* Nome */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Seu nome completo"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>

          {/* Email e Telefone */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">
                E-mail <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemplo@email.com"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">Telefone</label>
              <input
                type="tel"
                value={telefone}
                onChange={(e) => setTelefone(formatarTelefone(e.target.value))}
                placeholder="(00) 00000-0000"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          {/* Senha e Confirmar senha */}
          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">
                Senha <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Senha segura"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">
                Confirmar Senha <span className="text-red-500">*</span>
              </label>
              <input
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="Repita a senha"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          {/* Botão */}
          <div className="flex justify-center">
            <button
              type="submit"
              className="bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 px-8 rounded-md transition"
            >
              Cadastrar
            </button>
          </div>

          {/* Link para login */}
          <div className="text-sm text-center mt-2 text-gray-600">
            Já tem conta?{" "}
            <button
              type="button"
              onClick={() => navigate("/")}
              className="text-teal-600 hover:underline"
            >
              Entrar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
