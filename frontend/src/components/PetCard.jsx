import { Link } from "react-router-dom";

const PetCard = ({ pet, onSelect, isSelected, onDelete }) => (
  <div
    onClick={onSelect}
    className={`cursor-pointer p-4 rounded shadow bg-white transition ${isSelected ? "bg-blue-50 border border-blue-200" : ""}`}
  >
    <h2 className="text-lg font-semibold">{pet.nome}</h2>
    <p className="text-sm text-gray-600">{pet.especie} • {pet.raca}</p>
    <div className="flex gap-2 mt-2">
      <Link to={`/cadastro-pet/${pet.pet_id}`}>
        <button className="text-teal-600 hover:text-teal-800 text-sm">Editar</button>
      </Link>
      <Link>
        <button onClick={() => onDelete(pet.pet_id)} className="text-red-600 hover:text-red-800 text-sm">Excluir</button>
      </Link>
    </div>
  </div>
);

export default PetCard;
