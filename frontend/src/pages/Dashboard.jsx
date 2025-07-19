import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { calcularIdadeAnosMeses, converterNivelParaNumero, converterNumeroParaNivel, converterSegParaMin, formatarData, formatarDataHora, retornaRefeicao } from "../utils/validacoes";
import Footer from "../components/Footer";
import PetCard from "../components/PetCard";
import PetDetails from "../components/PetDetails";
import AlimentacaoForm from "../components/AlimentacaoForm";
import RefeicoesList from "../components/RefeicoesList";
import AtividadesList from "../components/AtividadesList";
import AtividadeGrafico from "../components/AtividadeGrafico";
import LocalizacoesList from "../components/LocalizacoesList";
import MapaLocalizacao from "../components/MapaLocalizacao";

import { useRef } from "react";

export default function Dashboard() {
  const [pets, setPets] = useState([]);
  const [erro, setErro] = useState(null);
  const [selectedPetIndex, setSelectedPetIndex] = useState(0);
  const [quantidadeRacao, setQuantidadeRacao] = useState("");
  const [tipoRefeicao, setTipoRefeicao] = useState("");
  const [ultimasRefeicoes, setUltimasRefeicoes] = useState([]);
  const [ultimasAtividades, setUltimasAtividades] = useState([]);
  const [graficoAtividade, setGraficoAtividade] = useState([]);
  const [localizacoes, setLocalizacoes] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [alertas, setAlertas] = useState([]);
  const [mostrarAlertas, setMostrarAlertas] = useState(false);
  const [temNovosAlertas, setTemNovosAlertas] = useState(false);
  const alertaRef = useRef(null);
  const nomeUsuario = localStorage.getItem("nome") || "Usuário";
  const [mostrarMenu, setMostrarMenu] = useState(false);
  const menuRef = useRef(null);

  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  // Função para excluir um pet
  const handleDeletePet = async (pet_id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    if(!confirm('Confirma exclusão do Pet?')) {
      return;
    }

    try {
      await axios.delete(`http://localhost:5000/api/pets/${pet_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setPets((prevPets) => prevPets.filter((pet) => pet.pet_id !== pet_id));

      setErro(""); // Limpa qualquer erro anterior
    } catch (err) {
      if (err.status === 401) {
        navigate("/");
        return;
      } else
        setErro("Erro ao excluir pet.");
    }
  };

  // Função para registrar alimentação
  const handleAlimentacao = async (pet_id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    if (!quantidadeRacao || !tipoRefeicao) {
      setErro("A quantidade e o tipo de refeição são obrigatórios.");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/pets/alimentacao",
        { pet_id, quantidade_g: quantidadeRacao, tipo_refeicao: tipoRefeicao },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setErro(""); // Limpa qualquer erro anterior
      setQuantidadeRacao(""); // Limpa os campos após o envio
      setTipoRefeicao(""); // Limpa os campos após o envio
      buscarUltimasRefeicoes(pet_id);

      alert("Alimentação registrada com sucesso!");
    } catch (err) {
      if (err.status === 401) {
        navigate("/");
        return;
      } else
        setErro("Erro ao registrar alimentação.");
    }
  };

  // Função para buscar as últimas atividades físicas
  const buscarUltimasAtividades = async (pet_id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/atividade-fisica/${pet_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUltimasAtividades(response.data); // Atualiza as atividades físicas

      // Formatando os dados para o gráfico
      const atividadesGrafico = response.data.map((atividade) => ({
        data: formatarDataHora(atividade.data_hora_inicio.split("T")), // Apenas a data
        nivel: converterNivelParaNumero(atividade.nivel_atividade),
      }));
      setGraficoAtividade(atividadesGrafico); // Atualiza os dados do gráfico
    } catch (err) {

      if (err.status === 404) {
        setUltimasAtividades([]);
        setGraficoAtividade([]);
      } else if (err.status === 401) {
        navigate("/");
        return;
      } else
        setErro("Erro ao buscar atividades físicas.");
    }
  };

  // Função para buscar as últimas refeições
  const buscarUltimasRefeicoes = async (pet_id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/alimentacoes/${pet_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUltimasRefeicoes(response.data); // Atualiza as refeições
    } catch (err) {
      if (err.status === 404)
        setUltimasRefeicoes([]);
      else if (err.status === 401) {
        navigate("/");
        return;
      } else
        setErro("Erro ao buscar últimas refeições.");
    }
  };

  // Buscar últimas localizações
  const buscarUltimasLocalizacoes = async (pet_id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await axios.get(
        `http://localhost:5000/api/localizacoes/${pet_id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const localizacoesRecebidas = response.data;

      setLocalizacoes(localizacoesRecebidas);

      // Selecionar automaticamente a última localização, se houver
      if (localizacoesRecebidas.length > 0) {
        const ultima = localizacoesRecebidas[0];
        setSelectedLocation(ultima);
      } else {
        setSelectedLocation(null);
      }
    } catch (err) {
      if (err.status === 404) {
        setLocalizacoes([]);
        setSelectedLocation();
      } else if (err.status === 401) {
        navigate("/");
        return;
      } else
        setErro("Erro ao buscar últimas localizações.");
    }
  };

  // Função para buscar alertas
  const buscarAlertas = async (pet_id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await axios.get(`http://localhost:5000/api/alertas/${pet_id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setAlertas(response.data);
      setTemNovosAlertas(response.data.some(alerta => !alerta.resolvido)); // Exibe ícone de alerta
    } catch (err) {
      if (err.status === 401) {
        navigate("/");
        return;
      } else {
        console.error("Erro ao buscar alertas", err);
        setErro("Erro ao buscar alertas.");
      }
    }
  };

  // Função para marcar alerta como resolvido
  const resolverAlerta = async (alerta_id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      await axios.patch(
        `http://localhost:5000/api/alertas/${alerta_id}/resolver`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );

      // Atualiza os alertas após a resolução
      if (pets[selectedPetIndex]) {
        buscarAlertas(pets[selectedPetIndex].pet_id);
      }
    } catch (err) {
      if (err.status === 401) {
        navigate("/");
        return;
      } else {
        console.error("Erro ao resolver alerta:", err);
        setErro("Erro ao marcar alerta como resolvido.");
      }
    }
  };

  useEffect(() => {
    function handleClickOutside(event) {
      const clicouForaDoAlerta =
        alertaRef.current && !alertaRef.current.contains(event.target);
      const clicouForaDoMenu =
        menuRef.current && !menuRef.current.contains(event.target);

      // Se clicou fora de ambos, fecha os dois menus
      if (clicouForaDoAlerta && clicouForaDoMenu) {
        setMostrarAlertas(false);
        setMostrarMenu(false);
      }

      if (clicouForaDoAlerta) {
        setMostrarAlertas(false);
      }

      if (clicouForaDoMenu) {
        setMostrarMenu(false);
      }
    }
    // Tecla ESQ
    function handleKeyDown(event) {
      if (event.key === "Escape") {
        setMostrarAlertas(false);
        setMostrarMenu(false);
      }
    }

    // Só adiciona o listener se algum menu estiver visível
    if (mostrarAlertas || mostrarMenu) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleKeyDown);
    }

    // Limpa o listener quando o efeito for desmontado ou os estados mudarem
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mostrarAlertas, mostrarMenu]);


  // Carregar a lista de pets ao montar o componente
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    axios
      .get("http://localhost:5000/api/pets", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => setPets(res.data))
      .catch((err) => {
        if (err.response && err.response.status === 401) {
          localStorage.removeItem("token");
          navigate("/");
          return;
        }
        setErro("Erro ao buscar pets. Verifique se você está logado.");
      });
  }, []);

  // Quando um pet é selecionado, buscar seuas informações
  useEffect(() => {
    if (pets[selectedPetIndex]) {
      buscarUltimasRefeicoes(pets[selectedPetIndex].pet_id);
      buscarUltimasAtividades(pets[selectedPetIndex].pet_id);
      buscarUltimasLocalizacoes(pets[selectedPetIndex].pet_id);
      buscarAlertas(pets[selectedPetIndex].pet_id);
    }
  }, [selectedPetIndex, pets]);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:5000");

    ws.onopen = () => {
      console.log("Conectado ao WebSocket do servidor.");
    };

    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);

      if (data.tipo === "alerta") {
        const novoAlerta = data.alerta;

        // Verifica se o alerta é para o pet atualmente selecionado
        if (pets[selectedPetIndex]?.pet_id === novoAlerta.pet_id) {
          setAlertas((prev) => [novoAlerta, ...prev]);
          setTemNovosAlertas(true);
        }
      }
    };

    ws.onerror = (err) => {
      console.error("Erro no WebSocket:", err);
    };

    return () => {
      ws.close();
    };
  }, [pets, selectedPetIndex]);

  const selectedPet = selectedPetIndex !== null ? pets[selectedPetIndex] : null;
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const nivelNumerico = payload[0].value;
      const nivelTexto = converterNumeroParaNivel(nivelNumerico);

      return (
        <div className="bg-white border px-3 py-2 rounded shadow text-sm">
          <p><strong>Data:</strong> {label}</p>
          <p><strong>Nível:</strong> {nivelTexto} ({nivelNumerico})</p>
        </div>
      );
    }

    return null;
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-4">
      {/* Header */}
      <div className="flex justify-between items-center bg-white p-4 rounded shadow">
        <h1 className="text-2xl font-bold text-gray-800">Petguard</h1>

        <div className="flex items-center gap-4 relative">
          {/* Nome do usuário */}
          <span className="flex gap-2 text-sm text-gray-800 font-medium">
            <i className="fas fa-user-circle text-xl mr-1" />
            {nomeUsuario}
          </span>

          {/* Notificações */}
          <div className="relative mt-1" ref={alertaRef}>
            <button
              onClick={() => setMostrarAlertas(!mostrarAlertas)}
              className="relative text-gray-600 hover:text-black"
              title="Notificações"
            >
              <i className="fas fa-bell text-xl cursor-pointer" />
              {temNovosAlertas && (
                <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
              )}
            </button>

            {mostrarAlertas && (
              <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded shadow-md z-50 max-h-96 overflow-y-auto">
                <div className="p-3 border-b text-gray-800 font-semibold">Notificações</div>
                {alertas.length === 0 ? (
                  <p className="p-3 text-sm text-gray-500">Sem notificações no momento.</p>
                ) : (
                  alertas.map((alerta, index) => (
                    <div
                      key={index}
                      className={`px-4 py-3 text-sm border-b hover:bg-gray-50 ${
                        alerta.resolvido ? "text-gray-500" : "text-gray-800 font-medium"
                      }`}
                    >
                      <div className="flex justify-between items-center">
                        <p className="font-medium">{alerta.mensagem}</p>
                        {!alerta.resolvido && (
                          <button
                            onClick={() => resolverAlerta(alerta.alerta_id)}
                            className="top-2 right-2 text-xs text-blue-600 hover:underline"
                          >
                            Resolver
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-gray-400">{formatarDataHora(alerta.data_hora)}</p>
                      
                    </div>
                  ))
                )}
              </div>
            )}
          </div>

          {/* Menu suspenso */}
          <div className="relative mt-1" ref={menuRef}>
            <button
              onClick={() => setMostrarMenu(!mostrarMenu)}
              className="text-gray-600 hover:text-black"
              title="Menu"
            >
              <i className="fas fa-ellipsis-v text-xl cursor-pointer" />
            </button>

            {mostrarMenu && (
              <div className="absolute right-0 mt-2 w-36 bg-white border border-gray-200 rounded shadow-md z-50">
                <Link to="/cadastro-pet">
                  <button className="flex w-full items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm cursor-pointer">
                    <i className="fas fa-plus-circle" /> Cadastrar Pet
                  </button>
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 border border-gray-300 px-4 py-2 rounded hover:bg-gray-100 text-sm cursor-pointer"
                >
                  <i className="fas fa-sign-out-alt" /> Sair
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="flex-grow">
        {erro && <p className="text-red-500 mt-4">{erro}</p>}
        {pets.length === 0 && !erro && (
          <div className="flex items-center h-full">
            <p className="text-gray-500 text-lg">Você não tem pets cadastrados.</p>
          </div>
        )}
        {pets.length > 0 && (
          <div className="flex flex-col md:flex-row gap-4 mt-6">
            {/* Barra lateral com cards dos pets */}
            <div className="w-full md:w-1/5 flex flex-col gap-4">
              {pets.map((pet, index) => (
                <PetCard
                  key={pet.pet_id}
                  pet={pet}
                  onSelect={() => setSelectedPetIndex(index)}
                  isSelected={index === selectedPetIndex}
                  onDelete={handleDeletePet}
                />
              ))}
            </div>

            {/* Área de detalhes e alimentação */}
            <div className="flex flex-col gap-4 w-full md:w-4/5">
              {selectedPet && (
                <>
                  <div className="flex gap-4">
                    {/* Detalhes do pet */}
                    <div className="w-full md:w-4/6">
                      <PetDetails {...selectedPet} />
                    </div>

                    {/* Liberação de alimentação */}
                    <div className="w-full md:w-2/6">
                      <AlimentacaoForm
                        onSubmit={() => handleAlimentacao(selectedPet.pet_id)}
                        quantidade={quantidadeRacao}
                        setQuantidade={setQuantidadeRacao}
                        tipo={tipoRefeicao}
                        setTipo={setTipoRefeicao}
                      />
                    </div>
                  </div>

                   {/* Exibição das últimas refeições */}
                  <RefeicoesList refeicoes={ultimasRefeicoes} />

                   {/* Últimas Atividades */}
                  <AtividadesList atividades={ultimasAtividades} />
                  
                  {/* Gráfico de Nível de Atividade */}
                  <AtividadeGrafico dados={graficoAtividade} />

                  {/* Exibição das últimas localizações no mapa */}
                  <LocalizacoesList
                    localizacoes={localizacoes}
                    onSelecionar={setSelectedLocation}
                  />

                  {/* Exibindo o mapa com a localização atual */}
                  {selectedLocation && <MapaLocalizacao localizacao={selectedLocation} />}
                </>
              )}
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
}
