import { formatarDataHora, converterSegParaMin } from "../utils/validacoes";

const AtividadesList = ({ atividades }) => (
  <div className="bg-white p-4 shadow rounded">
    <h2 className="text-xl font-semibold mb-2">Últimas Atividades</h2>
    <div className="flex gap-4 overflow-x-auto">
      {atividades.map((atv, idx) => (
        <div key={idx} className="min-w-[190px] bg-gray-200 p-3 text-sm rounded">
          <p><strong>Início:</strong> {formatarDataHora(atv.data_hora_inicio)}</p>
          <p><strong>Fim:</strong> {formatarDataHora(atv.data_hora_fim)}</p>
          <p><strong>Nível:</strong> {atv.nivel_atividade}</p>
          <p><strong>Duração:</strong> {converterSegParaMin(atv.duracao_segundos)} min</p>
          <p><strong>Passos:</strong> {atv.passos_estimados}</p>
        </div>
      ))}
    </div>
  </div>
);

export default AtividadesList;
