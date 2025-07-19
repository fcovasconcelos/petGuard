import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { validarData } from "../utils/validacoes";

export default function CadastroPet() {
  const [nome, setNome] = useState("");
  const [especie, setEspecie] = useState("");
  const [raca, setRaca] = useState("");
  const [peso_kg, setPesoKg] = useState("");
  const [data_nascimento, setDataNascimento] = useState("");
  const [erro, setErro] = useState("");
  const [sucesso, setSucesso] = useState("");
  const { pet_id } = useParams(); // Obtém o pet_id da URL
  const navigate = useNavigate();

  useEffect(() => {
    if (pet_id) {
      // Se houver pet_id, buscar os dados do pet para edição
      const token = localStorage.getItem("token");
      if (!token) {
        navigate('/');
      }
      axios
        .get(`http://localhost:5000/api/pets/${pet_id}`, {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => {
          const pet = res.data;
          setNome(pet.nome);
          setEspecie(pet.especie);
          setRaca(pet.raca);
          setPesoKg(pet.peso_kg);
          setDataNascimento(pet.data_nascimento);
        })
        .catch((err) => {
          if (err.response && err.response.status === 401) {
            localStorage.removeItem("token");
            navigate("/");
            return;
          }
          setErro("Erro ao carregar os dados do pet.");
        });
    }
  }, [pet_id]);

  const handleCadastroPet = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      //setErro("Você precisa estar logado para cadastrar um pet.");
      //setSucesso("");
      return;
    }

    if (!validarData(data_nascimento)) {
      setErro("A data de nascimento não pode ser no futuro.");
      setSucesso("");
      return;
    }

    try {
      if (pet_id) {
        // Se for um pet já existente, realiza a edição
        await axios.put(
          `http://localhost:5000/api/pets/${pet_id}`,
          { pet_id, nome, especie, raca, peso_kg, data_nascimento },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setSucesso("Pet atualizado com sucesso!");
      } else {
        await axios.post(
          "http://localhost:5000/api/pets",
          { nome, especie, raca, peso_kg, data_nascimento },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setSucesso("Pet cadastrado com sucesso!");
      }
      setErro("");
      navigate("/dashboard")
      //setTimeout(() => navigate("/dashboard"), 2000);
    } catch (err) {
      
      if (err.response && err.response.status === 401) {
        // Sessão expirada ou token inválido
        localStorage.removeItem("token"); // remove token inválido
        navigate("/");
        return;
      }
      console.error(err);
      setErro("Erro ao cadastrar pet.");
      setSucesso("");
    }
  };

  return (
    <div className="min-h-screen flex items-start pt-[60px] justify-center bg-gray-100 px-4">
      <div className="bg-white rounded-lg shadow-sm p-8 w-full max-w-4xl">
        <h2 className="text-3xl font-semibold text-teal-700 text-center mb-6">
          {pet_id ? "Editar Pet" : "Cadastrar Pet"}
        </h2>

        {erro && (
          <p className="text-red-600 text-sm mb-4 text-center">{erro}</p>
        )}
        {sucesso && (
          <p className="text-green-600 text-sm mb-4 text-center">{sucesso}</p>
        )}

        <form onSubmit={(e) => { e.preventDefault(); handleCadastroPet(); }} className="space-y-5">
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Nome <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Nome do pet"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
            />
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">
                Espécie <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={especie}
                onChange={(e) => setEspecie(e.target.value)}
                placeholder="Ex: cão, gato..."
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">
                Raça <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                value={raca}
                onChange={(e) => setRaca(e.target.value)}
                placeholder="Raça do pet"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">
                Peso (kg) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                value={peso_kg}
                onChange={(e) => setPesoKg(e.target.value)}
                placeholder="Ex: 5.2"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
            <div className="w-1/2">
              <label className="block text-gray-700 font-medium mb-1">
                Data de nascimento <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                value={data_nascimento}
                onChange={(e) => setDataNascimento(e.target.value)}
                className="w-full px-4 py-2.5 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-teal-500 text-sm"
              />
            </div>
          </div>

          <div className="flex justify-center gap-4 pt-2">
            <button
              type="submit"
              className="w-40 bg-teal-600 hover:bg-teal-700 text-white font-medium py-2.5 rounded-md transition"
            >
              {pet_id ? "Atualizar" : "Cadastrar"}
            </button>
            <button
              type="button"
              onClick={() => navigate("/dashboard")}
              className="w-40 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-2.5 rounded-md transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
