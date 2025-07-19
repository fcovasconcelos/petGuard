const AlimentacaoForm = ({ onSubmit, quantidade, setQuantidade, tipo, setTipo }) => (
  <div className="bg-white p-4 shadow rounded min-h-52">
    <h3 className="text-lg font-semibold mb-2">Liberar Alimentação</h3>
    
    <input
      type="number"
      placeholder="Quantidade de ração (g)"
      value={quantidade}
      onChange={(e) => setQuantidade(e.target.value)}
      className="w-full px-3 py-2 mb-2 border border-gray-300 rounded-md text-sm"
    />
    <select
      value={tipo}
      onChange={(e) => setTipo(e.target.value)}
      className="w-full px-3 py-2 mb-4 border border-gray-300 rounded-md text-sm"
    >
      <option value="">Selecione o tipo de refeição</option>
      <option value="cafe_da_manha">Café da manhã</option>
      <option value="almoco">Almoço</option>
      <option value="jantar">Jantar</option>
      <option value="extra">Extra</option>
    </select>
    <button onClick={onSubmit} className="w-full bg-teal-600 hover:bg-teal-700 text-white py-2 rounded-md text-sm">
      Liberar Alimentação
    </button>
  </div>
);

export default AlimentacaoForm;
