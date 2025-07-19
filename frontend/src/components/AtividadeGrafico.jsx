import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { converterNumeroParaNivel } from "../utils/validacoes";

const AtividadeGrafico = ({ dados }) => {
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const nivel = converterNumeroParaNivel(payload[0].value);
      return (
        <div className="bg-white border px-3 py-2 rounded text-sm shadow">
          <p><strong>Data:</strong> {label}</p>
          <p><strong>Nível:</strong> {nivel}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white p-4 shadow rounded">
      <h2 className="text-xl font-semibold mb-2">Nível de Atividade</h2>
      {dados.length > 0 && (
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={dados}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="data" />
            <YAxis domain={[0, 3]} ticks={[1, 2, 3]} />
            <Tooltip content={<CustomTooltip />} />
            <Line type="monotone" dataKey="nivel" stroke="#16a34a" strokeWidth={3} />
          </LineChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AtividadeGrafico;
