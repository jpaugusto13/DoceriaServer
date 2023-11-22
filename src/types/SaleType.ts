import PaymentType from "./PaymentType";
import ProdutType from "./ProductType";

type SaleType = {
  id: number;
  pagamento: PaymentType[];
  valor: number;
  data_venda: Date;
  hora_venda: string;
  produtos: ProdutType[];
  observacao: string;
  status_venda: "concluida" | "cancelada" | "analise";
}

export default SaleType;