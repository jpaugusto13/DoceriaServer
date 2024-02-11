import AccessType from "./AccessType";

interface EmployeeType extends AccessType {
  id: number;
  name: string;
  cpf: string;
  birthday: Date;
  image: string;
  email: string;
  phone: string;
}

export default EmployeeType;