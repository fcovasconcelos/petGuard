import { formatarDataHora } from "../utils/validacoes";

const LocalizacoesList = ({ localizacoes, onSelecionar }) => (
  <div className="bg-white p-4 shadow rounded">
    <h2 className="text-xl font-semibold mb-2">Últimas Localizações</h2>
    <div className="flex gap-4 flex-wrap">
      {localizacoes.map((loc, idx) => (
        <div
          key={idx}
          className="bg-gray-200 p-3 text-sm rounded cursor-pointer"
          onClick={() => onSelecionar(loc)}
        >
          <p><strong>Data:</strong> {formatarDataHora(loc.data_hora)}</p>
          <p><strong>Latitude:</strong> {loc.latitude}</p>
          <p><strong>Longitude:</strong> {loc.longitude}</p>
        </div>
      ))}
    </div>
  </div>
);

export default LocalizacoesList;
