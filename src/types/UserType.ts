import AcessType from "./AccessType";

interface UserType extends AcessType {
  id: number;
  email: string;
  password: string
}

export default UserType;