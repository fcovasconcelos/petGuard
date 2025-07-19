import { calcularIdadeAnosMeses } from "../utils/validacoes";

const PetDetails = ({ nome, data_nascimento, peso_kg, raca, especie }) => (
  <div className="bg-white p-4 shadow rounded min-h-52">
    <h2 className="text-xl font-semibold mb-2">Detalhes de {nome}</h2>
    <p><strong>Espécie:</strong> {especie}</p>
    <p><strong>Idade:</strong> {calcularIdadeAnosMeses(data_nascimento)}</p>
    <p><strong>Peso:</strong> {peso_kg}kg</p>
    <p><strong>Raça:</strong> {raca}</p>
  </div>
);

export default PetDetails;
