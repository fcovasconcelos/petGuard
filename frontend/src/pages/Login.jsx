import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [erro, setErro] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro("");
    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", {
        email,
        senha,
      }); 

      localStorage.setItem("token", response.data.token);
      localStorage.setItem("nome", response.data.nome); 
      navigate("/dashboard");
    } catch (err) {
      setErro("Usuário e/ou senha inválidos.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row">
      
      {/* Lado esquerdo (branding) */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-green-500 to-green-700 text-white flex flex-col justify-center items-center p-8">
        <div className="text-4xl md:text-5xl font-bold mb-4 flex items-center gap-3">
          <i className="fas fa-paw"></i> PetGuard
        </div>
        <p className="text-base md:text-lg text-center max-w-md">
          Proteja e acompanhe seus pets com facilidade e segurança.
        </p>
      </div>

      {/* Lado direito (formulário) */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 bg-white">
        <div className="w-full max-w-md">
          <h2 className="text-2xl md:text-3xl font-bold text-teal-700 text-center mb-6">
            Entrar
          </h2>

          {erro && (
            <p className="text-red-600 text-sm mb-4 text-center">{erro}</p>
          )}

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label htmlFor="email" className="block text-gray-700 font-medium mb-1">
                E-mail
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <i className="fas fa-envelope text-gray-400 mr-2"></i>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Digite seu e-mail"
                  required
                  className="w-full focus:outline-none text-sm"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-gray-700 font-medium mb-1">
                Senha
              </label>
              <div className="flex items-center border border-gray-300 rounded-md px-3 py-2">
                <i className="fas fa-lock text-gray-400 mr-2"></i>
                <input
                  type="password"
                  id="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                  placeholder="Digite sua senha"
                  required
                  className="w-full focus:outline-none text-sm"
                />
              </div>
            </div>

            {/* Botões */}
            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <button
                type="submit"
                className="w-full sm:w-1/2 bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 rounded-md transition"
              >
                Entrar
              </button>
              <a
                href="/esqueci-senha"
                className="w-full sm:w-1/2 text-center bg-gray-100 hover:bg-gray-200 text-teal-700 font-semibold py-2 rounded-md transition"
              >
                Esqueci a senha
              </a>
            </div>
          </form>

          <div className="text-sm text-center mt-6 text-gray-600">
            Ainda não tem conta?{" "}
            <a href="/cadastro" className="text-teal-600 hover:underline">
              Cadastre-se
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
