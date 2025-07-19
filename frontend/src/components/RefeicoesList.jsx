import { formatarDataHora, retornaRefeicao } from "../utils/validacoes";

const RefeicoesList = ({ refeicoes }) => (
  <div className="bg-white p-4 shadow rounded">
    <h2 className="text-xl font-semibold mb-2">Últimas Refeições</h2>
    <div className="flex gap-4 overflow-x-auto">
      {refeicoes.map(ref => (
        <div key={ref.alimentacao_id} className="bg-gray-200 rounded p-3 text-sm md:w-1/5">
          <p><strong>Data:</strong> {formatarDataHora(ref.data_hora)}</p>
          <p><strong>Quantidade:</strong> {ref.quantidade_g}g</p>
          <p><strong>Tipo:</strong> {retornaRefeicao(ref.tipo_refeicao)}</p>
        </div>
      ))}
    </div>
  </div>
);

export default RefeicoesList;
