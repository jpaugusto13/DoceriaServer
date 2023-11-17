type SaleType = {
  id: number;
  forma_pagamento: string;
  valor: number;
  data_venda: Date;
  hora_venda: string;
  id_produto_vendido: number;
  status_venda: "concluida" | "cancelada" | "analise";
}

export default SaleType;