import AcessType from "./AcessType";

interface UserType extends AcessType {
  id: number;
  nome: string;
  sobrenome: string;
  email: string;
  cpf: number;
  aniversario: Date;
  senha: string;
  telefone: number;
}

export default UserType;