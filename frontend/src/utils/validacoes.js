// Função para validar a senha
export const validarSenha = (senha) => {
  const regex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/;
  return regex.test(senha);
};

// Função para validar o email
export const validarEmail = (email) => {
  const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return regex.test(email);
};

// Função para formatar o telefone
export const formatarTelefone = (value) => {
  return value
    .replace(/\D/g, "") // Remove qualquer caractere não numérico
    .replace(/^(\d{2})(\d)/, "($1) $2") // Adiciona o parêntese no DDD
    .replace(/(\d{5})(\d{4})$/, "$1-$2"); // Adiciona o hífen no número
};

export const validarData = (data) => {
  const hoje = new Date().toISOString().split("T")[0];
  const dataSelecionada = new Date(data).toISOString().split("T")[0];

  return dataSelecionada <= hoje;
};

export const calcularIdadeAnosMeses = (dataNascimento) => {
  const hoje = new Date();
  const nascimento = new Date(dataNascimento);

  let anos = hoje.getFullYear() - nascimento.getFullYear();
  let meses = hoje.getMonth() - nascimento.getMonth();

  if (hoje.getDate() < nascimento.getDate()) {
    meses--;
  }

  if (meses < 0) {
    anos--;
    meses += 12;
  }

  const partes = [];
  if (anos > 0) partes.push(`${anos} ${anos === 1 ? 'ano' : 'anos'}`);
  if (meses > 0) partes.push(`${meses} ${meses === 1 ? 'mês' : 'meses'}`);
  if (partes.length === 0) partes.push('0 meses'); // se idade < 1 mês

  return partes.join(' e ');
}

export const formatarDataHora = (dataISO) => {
  const data = new Date(dataISO);
  const dia = String(data.getDate()).padStart(2, "0");
  const mes = String(data.getMonth() + 1).padStart(2, "0");
  const ano = String(data.getFullYear()).slice(-2);
  const hora = String(data.getHours()).padStart(2, "0");
  const minuto = String(data.getMinutes()).padStart(2, "0");
  return `${dia}/${mes}/${ano} ${hora}:${minuto}`;
}

export const formatarData = (dataString) => {
  const [ano, mes, dia] = dataString.split("-");
  return `${dia}/${mes}`;
}

export const converterNivelParaNumero = (nivel) => {
  switch (nivel.toLowerCase()) {
    case "leve":
      return 1;
    case "moderado":
      return 2;
    case "intenso":
      return 3;
    default:
      return 0; // Caso desconhecido
  }
};

export const converterNumeroParaNivel = (numero) => {
  switch (numero) {
    case 1:
      return "Leve";
    case 2:
      return "Moderado";
    case 3:
      return "Intenso";
    default:
      return "Desconhecido";
  }
};

export const converterSegParaMin = (segundos) => {
  return segundos / 60;
};

export const retornaRefeicao = (refeicao) => {
  switch (refeicao) {
    case "cafe_da_manha":
      return "Café da manhã"; 
    case "almoco":
      return "Almoço";
    case "jantar":
      return "Jantar";
    case "extra":
      return "Extra";
    default:
      return "Desconhecido";
  }
}