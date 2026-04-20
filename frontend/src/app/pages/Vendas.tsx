import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, User, CreditCard, Clock, Check, ShoppingBag, Bike, UtensilsCrossed, X, DollarSign } from "lucide-react";

interface Produto {
  id: number;
  nome: string;
  preco: number;
  categoria: string;
}

interface Adicional {
  id: number;
  nome: string;
  preco: number;
}

interface ItemPedido {
  produto: Produto;
  quantidade: number;
  adicionais: Adicional[];
  observacao: string;
}

type TipoPedido = "consumo-local" | "retirada" | "delivery";
type FormaPagamento = "dinheiro" | "pix" | "credito" | "debito";

interface Pedido {
  id: number;
  numero: string;
  items: ItemPedido[];
  total: number;
  vendedor: string;
  status: "preparando" | "aguardando-pagamento" | "finalizado";
  horario: string;
  tipo: TipoPedido;
  mesa?: number;
  formaPagamento?: FormaPagamento;
  valorPago?: number;
  troco?: number;
}

const produtosMock: Produto[] = [
  { id: 1, nome: "Crepe de Frango", preco: 18.90, categoria: "Salgado" },
  { id: 2, nome: "Crepe de Carne", preco: 20.90, categoria: "Salgado" },
  { id: 3, nome: "Crepe 4 Queijos", preco: 19.90, categoria: "Salgado" },
  { id: 4, nome: "Crepe de Nutella", preco: 16.90, categoria: "Doce" },
  { id: 5, nome: "Crepe de Morango", preco: 17.90, categoria: "Doce" },
  { id: 6, nome: "Crepe de Banana", preco: 15.90, categoria: "Doce" },
  { id: 7, nome: "Churros Doce de Leite", preco: 12.90, categoria: "Churros" },
  { id: 8, nome: "Churros Chocolate", preco: 13.90, categoria: "Churros" },
  { id: 9, nome: "Coca-Cola 350ml", preco: 5.00, categoria: "Bebida" },
  { id: 10, nome: "Suco de Laranja", preco: 7.00, categoria: "Bebida" },
];

const adicionaisMock: Adicional[] = [
  { id: 1, nome: "Queijo Extra", preco: 3.00 },
  { id: 2, nome: "Bacon", preco: 4.00 },
  { id: 3, nome: "Catupiry", preco: 3.50 },
  { id: 4, nome: "Frango Extra", preco: 5.00 },
  { id: 5, nome: "Nutella Extra", preco: 4.50 },
  { id: 6, nome: "Morango Extra", preco: 3.00 },
];

const pedidosMock: Pedido[] = [
  {
    id: 1,
    numero: "#001",
    items: [
      { produto: produtosMock[0], quantidade: 2 },
      { produto: produtosMock[3], quantidade: 1 },
    ],
    total: 54.70,
    vendedor: "Ana Silva",
    status: "preparando",
    horario: "14:30",
    tipo: "retirada",
    formaPagamento: "pix",
  },
  {
    id: 2,
    numero: "#002",
    items: [{ produto: produtosMock[1], quantidade: 1 }],
    total: 20.90,
    vendedor: "João Santos",
    status: "aguardando-pagamento",
    horario: "14:45",
    tipo: "consumo-local",
    mesa: 5,
  },
];

export default function Vendas() {
  const [carrinho, setCarrinho] = useState<ItemPedido[]>([]);
  const [pedidos, setPedidos] = useState<Pedido[]>(pedidosMock);
  const [vendedor] = useState("Ana Silva");
  const [searchTerm, setSearchTerm] = useState("");
  const [tipoPedido, setTipoPedido] = useState<TipoPedido>("consumo-local");
  const [mesaSelecionada, setMesaSelecionada] = useState<number | null>(null);
  const [mostrarFinalizacao, setMostrarFinalizacao] = useState(false);
  const [pedidoParaPagamento, setPedidoParaPagamento] = useState<Pedido | null>(null);
  const [formaPagamento, setFormaPagamento] = useState<FormaPagamento>("dinheiro");
  const [valorPago, setValorPago] = useState<string>("");
  const [produtoParaAdicionais, setProdutoParaAdicionais] = useState<Produto | null>(null);
  const [adicionaisSelecionados, setAdicionaisSelecionados] = useState<Adicional[]>([]);
  const [observacaoAtual, setObservacaoAtual] = useState<string>("");
  const [pedidoParaImprimir, setPedidoParaImprimir] = useState<Pedido | null>(null);

  const abrirAdicionais = (produto: Produto) => {
    setProdutoParaAdicionais(produto);
    setAdicionaisSelecionados([]);
  };

  const adicionarAoCarrinho = (produto: Produto, adicionais: Adicional[] = [], observacao: string = "") => {
    setCarrinho([...carrinho, { produto, quantidade: 1, adicionais, observacao }]);
    setProdutoParaAdicionais(null);
    setAdicionaisSelecionados([]);
    setObservacaoAtual("");
  };

  const toggleAdicional = (adicional: Adicional) => {
    if (adicionaisSelecionados.find(a => a.id === adicional.id)) {
      setAdicionaisSelecionados(adicionaisSelecionados.filter(a => a.id !== adicional.id));
    } else {
      setAdicionaisSelecionados([...adicionaisSelecionados, adicional]);
    }
  };

  const removerDoCarrinho = (produtoId: number) => {
    setCarrinho(carrinho.filter((item) => item.produto.id !== produtoId));
  };

  const alterarQuantidade = (produtoId: number, quantidade: number) => {
    if (quantidade <= 0) {
      removerDoCarrinho(produtoId);
      return;
    }
    setCarrinho(
      carrinho.map((item) =>
        item.produto.id === produtoId ? { ...item, quantidade } : item
      )
    );
  };

  const calcularTotal = () => {
    return carrinho.reduce((total, item) => {
      const precoBase = item.produto.preco * item.quantidade;
      const precoAdicionais = item.adicionais.reduce((sum, ad) => sum + ad.preco, 0) * item.quantidade;
      return total + precoBase + precoAdicionais;
    }, 0);
  };

  const calcularTotalItem = (item: ItemPedido) => {
    const precoBase = item.produto.preco * item.quantidade;
    const precoAdicionais = item.adicionais.reduce((sum, ad) => sum + ad.preco, 0) * item.quantidade;
    return precoBase + precoAdicionais;
  };

  const confirmarPedido = () => {
    if (carrinho.length === 0) return;
    if (tipoPedido === "consumo-local" && !mesaSelecionada) {
      alert("Selecione uma mesa para consumo no local");
      return;
    }

    setMostrarFinalizacao(true);
  };

  const finalizarPedido = () => {
    const novoPedido: Pedido = {
      id: pedidos.length + 1,
      numero: `#${String(pedidos.length + 1).padStart(3, "0")}`,
      items: carrinho,
      total: calcularTotal(),
      vendedor,
      status: tipoPedido === "consumo-local" ? "aguardando-pagamento" : "preparando",
      horario: new Date().toLocaleTimeString("pt-BR", {
        hour: "2-digit",
        minute: "2-digit",
      }),
      tipo: tipoPedido,
      mesa: tipoPedido === "consumo-local" ? mesaSelecionada! : undefined,
    };

    setPedidos([novoPedido, ...pedidos]);
    setCarrinho([]);
    setMostrarFinalizacao(false);
    setMesaSelecionada(null);
  };

  const abrirPagamento = (pedido: Pedido) => {
    setPedidoParaPagamento(pedido);
    setValorPago("");
  };

  const processarPagamento = () => {
    if (!pedidoParaPagamento) return;

    const valorPagoNum = parseFloat(valorPago) || 0;
    const troco = formaPagamento === "dinheiro" ? valorPagoNum - pedidoParaPagamento.total : 0;

    if (formaPagamento === "dinheiro" && valorPagoNum < pedidoParaPagamento.total) {
      alert("Valor pago insuficiente!");
      return;
    }

    const pedidoFinalizado = {
      ...pedidoParaPagamento,
      status: "finalizado" as const,
      formaPagamento,
      valorPago: valorPagoNum,
      troco: troco > 0 ? troco : undefined,
    };

    setPedidos(
      pedidos.map((pedido) =>
        pedido.id === pedidoParaPagamento.id ? pedidoFinalizado : pedido
      )
    );

    setPedidoParaPagamento(null);
    setFormaPagamento("dinheiro");
    setValorPago("");
    setPedidoParaImprimir(pedidoFinalizado);
  };

  const atualizarStatusPedido = (pedidoId: number, novoStatus: Pedido["status"]) => {
    setPedidos(
      pedidos.map((pedido) =>
        pedido.id === pedidoId ? { ...pedido, status: novoStatus } : pedido
      )
    );
  };

  const produtosFiltrados = produtosMock.filter((produto) =>
    produto.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="h-full p-4 md:p-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 md:gap-6">
      {/* Produtos */}
      <div className="lg:col-span-2 space-y-4 md:space-y-6">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Nova Venda</h1>
          <p className="text-gray-600">Selecione os produtos do pedido</p>
        </div>

        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar produtos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 md:gap-4">
          {produtosFiltrados.map((produto) => (
            <motion.button
              key={produto.id}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                if (produto.categoria === "Salgado" || produto.categoria === "Doce" || produto.categoria === "Churros") {
                  abrirAdicionais(produto);
                } else {
                  adicionarAoCarrinho(produto);
                }
              }}
              className="bg-white p-6 rounded-xl border-2 border-gray-200 hover:border-orange-400 transition-all text-left"
            >
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-lg text-gray-900">{produto.nome}</h3>
                <span className="text-xs bg-gradient-to-r from-orange-600 to-orange-700 text-white px-2 py-1 rounded">
                  {produto.categoria}
                </span>
              </div>
              <p className="text-2xl bg-gradient-to-r from-orange-600 to-orange-700 bg-clip-text text-transparent">
                R$ {produto.preco.toFixed(2)}
              </p>
            </motion.button>
          ))}
        </div>
      </div>

      {/* Carrinho */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6 flex flex-col lg:sticky lg:top-6 h-fit">
        <div className="flex items-center gap-2 mb-6 pb-4 border-b border-gray-200">
          <User size={20} className="text-gray-600" />
          <span className="text-gray-900">{vendedor}</span>
        </div>

        <h2 className="text-xl text-gray-900 mb-4">Pedido Atual</h2>

        {carrinho.length === 0 ? (
          <div className="flex-1 flex items-center justify-center py-12">
            <p className="text-gray-400">Nenhum item adicionado</p>
          </div>
        ) : (
          <>
            <div className="space-y-3 mb-6 max-h-64 overflow-y-auto">
              <AnimatePresence>
                {carrinho.map((item, index) => (
                  <motion.div
                    key={`${item.produto.id}-${index}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="bg-gray-50 p-3 rounded-lg"
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex-1">
                        <p className="text-gray-900">{item.produto.nome}</p>
                        <p className="text-sm text-gray-500">
                          R$ {item.produto.preco.toFixed(2)}
                        </p>
                        {item.adicionais.length > 0 && (
                          <div className="mt-1 space-y-0.5">
                            {item.adicionais.map((ad) => (
                              <p key={ad.id} className="text-xs text-orange-600">
                                + {ad.nome} (R$ {ad.preco.toFixed(2)})
                              </p>
                            ))}
                          </div>
                        )}
                        {item.observacao && (
                          <p className="text-xs text-gray-500 italic mt-1">
                            "{item.observacao}"
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => setCarrinho(carrinho.filter((_, i) => i !== index))}
                        className="text-red-600 hover:text-red-700"
                      >
                        <X size={18} />
                      </button>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          const newCarrinho = [...carrinho];
                          if (newCarrinho[index].quantidade > 1) {
                            newCarrinho[index].quantidade--;
                          } else {
                            newCarrinho.splice(index, 1);
                          }
                          setCarrinho(newCarrinho);
                        }}
                        className="w-8 h-8 bg-white rounded border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                      >
                        -
                      </button>
                      <span className="w-12 text-center text-gray-900">{item.quantidade}</span>
                      <button
                        onClick={() => {
                          const newCarrinho = [...carrinho];
                          newCarrinho[index].quantidade++;
                          setCarrinho(newCarrinho);
                        }}
                        className="w-8 h-8 bg-white rounded border border-gray-200 hover:bg-gray-100 flex items-center justify-center"
                      >
                        +
                      </button>
                      <span className="ml-auto text-gray-900">
                        R$ {calcularTotalItem(item).toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>

            {/* Tipo de Pedido */}
            <div className="mb-6 space-y-3">
              <label className="block text-sm text-gray-700">Tipo de Pedido</label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => {
                    setTipoPedido("consumo-local");
                    setMesaSelecionada(null);
                  }}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    tipoPedido === "consumo-local"
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <UtensilsCrossed
                    size={20}
                    className={`mx-auto mb-1 ${
                      tipoPedido === "consumo-local" ? "text-orange-600" : "text-gray-600"
                    }`}
                  />
                  <p className="text-xs text-center text-gray-900">Local</p>
                </button>
                <button
                  onClick={() => setTipoPedido("retirada")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    tipoPedido === "retirada"
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <ShoppingBag
                    size={20}
                    className={`mx-auto mb-1 ${
                      tipoPedido === "retirada" ? "text-orange-600" : "text-gray-600"
                    }`}
                  />
                  <p className="text-xs text-center text-gray-900">Retirada</p>
                </button>
                <button
                  onClick={() => setTipoPedido("delivery")}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    tipoPedido === "delivery"
                      ? "border-orange-600 bg-orange-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <Bike
                    size={20}
                    className={`mx-auto mb-1 ${
                      tipoPedido === "delivery" ? "text-orange-600" : "text-gray-600"
                    }`}
                  />
                  <p className="text-xs text-center text-gray-900">Delivery</p>
                </button>
              </div>

              {tipoPedido === "consumo-local" && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="space-y-2"
                >
                  <label className="block text-sm text-gray-700">Selecionar Mesa</label>
                  <div className="grid grid-cols-5 gap-2">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((mesa) => (
                      <button
                        key={mesa}
                        onClick={() => setMesaSelecionada(mesa)}
                        className={`p-3 rounded-lg border-2 transition-all ${
                          mesaSelecionada === mesa
                            ? "border-orange-600 bg-orange-50 text-orange-600"
                            : "border-gray-200 hover:border-gray-300 text-gray-900"
                        }`}
                      >
                        {mesa}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </div>
          </>
        )}

        <div className="pt-4 border-t border-gray-200 space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Total</span>
            <span className="text-2xl text-gray-900">
              R$ {calcularTotal().toFixed(2)}
            </span>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={confirmarPedido}
            disabled={carrinho.length === 0}
            className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg hover:shadow-lg transition-all disabled:bg-gray-300 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            <Check size={20} />
            Confirmar Pedido
          </motion.button>
        </div>
      </div>

      </div>

      {/* Pedidos Recentes */}
      <div className="col-span-1 lg:col-span-3 mt-6">
        <h2 className="text-2xl text-gray-900 mb-4">Pedidos do Dia</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-4">
          {pedidos.map((pedido) => {
            const getTipoPedidoIcon = () => {
              if (pedido.tipo === "consumo-local") return <UtensilsCrossed size={16} />;
              if (pedido.tipo === "retirada") return <ShoppingBag size={16} />;
              return <Bike size={16} />;
            };

            const getTipoPedidoLabel = () => {
              if (pedido.tipo === "consumo-local") return `Mesa ${pedido.mesa}`;
              if (pedido.tipo === "retirada") return "Retirada";
              return "Delivery";
            };

            return (
              <motion.div
                key={pedido.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 rounded-xl border border-gray-200"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl text-gray-900 mb-1">{pedido.numero}</h3>
                    <p className="text-sm text-gray-500 flex items-center gap-1">
                      <Clock size={14} />
                      {pedido.horario}
                    </p>
                    <p className="text-sm text-orange-600 flex items-center gap-1 mt-1">
                      {getTipoPedidoIcon()}
                      {getTipoPedidoLabel()}
                    </p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs ${
                      pedido.status === "finalizado"
                        ? "bg-green-100 text-green-700"
                        : pedido.status === "preparando"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-orange-100 text-orange-700"
                    }`}
                  >
                    {pedido.status === "finalizado"
                      ? "Finalizado"
                      : pedido.status === "preparando"
                      ? "Preparando"
                      : "Aguardando"}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  {pedido.items.map((item, idx) => (
                    <p key={idx} className="text-sm text-gray-600">
                      {item.quantidade}x {item.produto.nome}
                    </p>
                  ))}
                </div>

                <div className="pt-4 border-t border-gray-100 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total</span>
                    <span className="text-lg text-gray-900">
                      R$ {pedido.total.toFixed(2)}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500">{pedido.vendedor}</p>

                  {pedido.formaPagamento && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-sm text-gray-600">
                        Pagamento: {pedido.formaPagamento}
                      </p>
                      {pedido.troco && pedido.troco > 0 && (
                        <p className="text-sm text-gray-600">
                          Troco: R$ {pedido.troco.toFixed(2)}
                        </p>
                      )}
                    </div>
                  )}

                  {pedido.status === "aguardando-pagamento" && (
                    <button
                      onClick={() => abrirPagamento(pedido)}
                      className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <CreditCard size={16} />
                      Pagar Conta
                    </button>
                  )}

                  {pedido.status === "preparando" && pedido.tipo !== "consumo-local" && (
                    <button
                      onClick={() => abrirPagamento(pedido)}
                      className="w-full mt-2 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
                    >
                      <Check size={16} />
                      Finalizar Pedido
                    </button>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Modal de Finalização */}
      <AnimatePresence>
        {mostrarFinalizacao && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
            >
              <h3 className="text-2xl text-gray-900 mb-6">Confirmar Pedido</h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tipo:</span>
                  <span className="text-gray-900">
                    {tipoPedido === "consumo-local"
                      ? `Consumo no Local - Mesa ${mesaSelecionada}`
                      : tipoPedido === "retirada"
                      ? "Retirada"
                      : "Delivery"}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Itens:</span>
                  <span className="text-gray-900">{carrinho.length}</span>
                </div>
                <div className="flex justify-between text-xl">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-orange-600">R$ {calcularTotal().toFixed(2)}</span>
                </div>
              </div>

              {tipoPedido === "consumo-local" ? (
                <div className="bg-orange-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-orange-900">
                    Este pedido ficará aguardando pagamento. O pagamento será
                    processado quando o cliente solicitar a conta.
                  </p>
                </div>
              ) : (
                <div className="bg-blue-50 p-4 rounded-lg mb-6">
                  <p className="text-sm text-blue-900 mb-3">
                    Como deseja finalizar este pedido?
                  </p>
                  <div className="space-y-2">
                    <button
                      onClick={() => {
                        finalizarPedido();
                      }}
                      className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      Enviar para Pedidos do Dia
                    </button>
                    <button
                      onClick={() => {
                        const novoPedido: Pedido = {
                          id: pedidos.length + 1,
                          numero: `#${String(pedidos.length + 1).padStart(3, "0")}`,
                          items: carrinho,
                          total: calcularTotal(),
                          vendedor,
                          status: "finalizado",
                          horario: new Date().toLocaleTimeString("pt-BR", {
                            hour: "2-digit",
                            minute: "2-digit",
                          }),
                          tipo: tipoPedido,
                          formaPagamento: "dinheiro",
                        };
                        setPedidos([novoPedido, ...pedidos]);
                        setCarrinho([]);
                        setMostrarFinalizacao(false);
                        setMesaSelecionada(null);
                      }}
                      className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
                    >
                      Finalizar Direto (Pago)
                    </button>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => setMostrarFinalizacao(false)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancelar
                </button>
                {tipoPedido === "consumo-local" && (
                  <button
                    onClick={finalizarPedido}
                    className="flex-1 px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors"
                  >
                    Confirmar
                  </button>
                )}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Adicionais */}
      <AnimatePresence>
        {produtoParaAdicionais && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h3 className="text-2xl text-gray-900">{produtoParaAdicionais.nome}</h3>
                  <p className="text-orange-600">R$ {produtoParaAdicionais.preco.toFixed(2)}</p>
                </div>
                <button
                  onClick={() => setProdutoParaAdicionais(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm text-gray-600 mb-2">Observações (opcional):</label>
                  <textarea
                    value={observacaoAtual}
                    onChange={(e) => setObservacaoAtual(e.target.value)}
                    placeholder="Ex: sem cebola, bem passado..."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none text-sm"
                    rows={2}
                  />
                </div>
                <p className="text-sm text-gray-600">Selecione os adicionais (opcional):</p>
                <div className="grid grid-cols-2 gap-3">
                  {adicionaisMock.map((adicional) => {
                    const selecionado = adicionaisSelecionados.find(a => a.id === adicional.id);
                    return (
                      <button
                        key={adicional.id}
                        onClick={() => toggleAdicional(adicional)}
                        className={`p-3 rounded-lg border-2 transition-all text-left ${
                          selecionado
                            ? "border-orange-600 bg-orange-50"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <p className="text-sm text-gray-900">{adicional.nome}</p>
                        <p className="text-xs text-orange-600">+ R$ {adicional.preco.toFixed(2)}</p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {adicionaisSelecionados.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Produto:</span>
                    <span className="text-gray-900">R$ {produtoParaAdicionais.preco.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Adicionais:</span>
                    <span className="text-gray-900">
                      R$ {adicionaisSelecionados.reduce((sum, a) => sum + a.preco, 0).toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between pt-2 border-t border-gray-200">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-orange-600">
                      R$ {(produtoParaAdicionais.preco + adicionaisSelecionados.reduce((sum, a) => sum + a.preco, 0)).toFixed(2)}
                    </span>
                  </div>
                </div>
              )}

              <div className="flex gap-3">
                <button
                  onClick={() => adicionarAoCarrinho(produtoParaAdicionais, [], observacaoAtual)}
                  className="flex-1 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Sem Adicionais
                </button>
                <button
                  onClick={() => adicionarAoCarrinho(produtoParaAdicionais, adicionaisSelecionados, observacaoAtual)}
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:shadow-lg transition-all"
                >
                  Adicionar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Pagamento */}
      <AnimatePresence>
        {pedidoParaPagamento && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl text-gray-900">Pagamento</h3>
                <button
                  onClick={() => setPedidoParaPagamento(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="bg-gray-50 p-4 rounded-lg mb-6">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Pedido:</span>
                  <span className="text-gray-900">{pedidoParaPagamento.numero}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Mesa:</span>
                  <span className="text-gray-900">{pedidoParaPagamento.mesa}</span>
                </div>
                <div className="flex justify-between text-xl">
                  <span className="text-gray-900">Total:</span>
                  <span className="text-orange-600">
                    R$ {pedidoParaPagamento.total.toFixed(2)}
                  </span>
                </div>
              </div>

              <div className="space-y-4 mb-6">
                <label className="block text-sm text-gray-700">Forma de Pagamento</label>
                <div className="grid grid-cols-2 gap-3">
                  {(["dinheiro", "pix", "credito", "debito"] as FormaPagamento[]).map((forma) => (
                    <button
                      key={forma}
                      onClick={() => setFormaPagamento(forma)}
                      className={`p-3 rounded-lg border-2 transition-all ${
                        formaPagamento === forma
                          ? "border-orange-600 bg-orange-50"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                    >
                      <DollarSign
                        size={20}
                        className={`mx-auto mb-1 ${
                          formaPagamento === forma ? "text-orange-600" : "text-gray-600"
                        }`}
                      />
                      <p className="text-xs text-center text-gray-900 capitalize">{forma}</p>
                    </button>
                  ))}
                </div>

                {formaPagamento === "dinheiro" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                  >
                    <label className="block text-sm text-gray-700 mb-2">Valor Pago</label>
                    <input
                      type="number"
                      step="0.01"
                      value={valorPago}
                      onChange={(e) => setValorPago(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                    />
                    {parseFloat(valorPago) > pedidoParaPagamento.total && (
                      <p className="text-sm text-green-600 mt-2">
                        Troco: R${" "}
                        {(parseFloat(valorPago) - pedidoParaPagamento.total).toFixed(2)}
                      </p>
                    )}
                  </motion.div>
                )}
              </div>

              <button
                onClick={processarPagamento}
                className="w-full bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
              >
                <Check size={20} />
                Confirmar Pagamento
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Modal de Impressão */}
      <AnimatePresence>
        {pedidoParaImprimir && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-6 max-w-md w-full"
            >
              <h3 className="text-xl text-gray-900 mb-4 text-center">Pedido Finalizado!</h3>

              <div className="mb-6">
                <NotaFiscal pedido={pedidoParaImprimir} />
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    window.print();
                  }}
                  className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Imprimir Nota
                </button>
                <button
                  onClick={() => setPedidoParaImprimir(null)}
                  className="flex-1 px-4 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Fechar
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

function NotaFiscal({ pedido }: { pedido: Pedido }) {
  return (
    <div className="bg-white p-6 border-2 border-gray-300 rounded-lg text-sm print:border-black" id="nota-fiscal">
      <div className="text-center mb-4 border-b-2 border-gray-300 pb-3">
        <img src="/src/imports/logo.png" alt="Logo" className="w-20 h-20 mx-auto mb-2 rounded-full" />
        <h2 className="text-lg font-bold">Creperia Mix Sabores</h2>
        <p className="text-xs text-gray-600">Comprovante de Venda</p>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Pedido:</span>
          <span className="font-semibold">{pedido.numero}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Data/Hora:</span>
          <span>{new Date().toLocaleDateString()} - {pedido.horario}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Vendedor:</span>
          <span>{pedido.vendedor}</span>
        </div>
        <div className="flex justify-between text-xs">
          <span className="text-gray-600">Tipo:</span>
          <span>
            {pedido.tipo === "consumo-local" && `Consumo Local - Mesa ${pedido.mesa}`}
            {pedido.tipo === "retirada" && "Retirada"}
            {pedido.tipo === "delivery" && "Delivery"}
          </span>
        </div>
      </div>

      <div className="border-t-2 border-b-2 border-gray-300 py-3 mb-4">
        <h3 className="font-semibold mb-2 text-xs">Itens do Pedido:</h3>
        {pedido.items.map((item, idx) => (
          <div key={idx} className="mb-2 text-xs">
            <div className="flex justify-between">
              <span>{item.quantidade}x {item.produto.nome}</span>
              <span>R$ {(item.produto.preco * item.quantidade).toFixed(2)}</span>
            </div>
            {item.adicionais.length > 0 && (
              <div className="ml-4 text-orange-600">
                {item.adicionais.map((ad, adIdx) => (
                  <div key={adIdx} className="flex justify-between">
                    <span>+ {ad.nome}</span>
                    <span>R$ {(ad.preco * item.quantidade).toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}
            {item.observacao && (
              <div className="ml-4 text-gray-600 italic text-xs">
                Obs: {item.observacao}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="space-y-1 mb-4">
        <div className="flex justify-between font-semibold">
          <span>TOTAL:</span>
          <span className="text-lg">R$ {pedido.total.toFixed(2)}</span>
        </div>
        {pedido.formaPagamento && (
          <>
            <div className="flex justify-between text-xs">
              <span>Forma de Pagamento:</span>
              <span className="capitalize">{pedido.formaPagamento}</span>
            </div>
            {pedido.valorPago && pedido.valorPago > 0 && (
              <div className="flex justify-between text-xs">
                <span>Valor Pago:</span>
                <span>R$ {pedido.valorPago.toFixed(2)}</span>
              </div>
            )}
            {pedido.troco && pedido.troco > 0 && (
              <div className="flex justify-between text-xs text-green-600">
                <span>Troco:</span>
                <span>R$ {pedido.troco.toFixed(2)}</span>
              </div>
            )}
          </>
        )}
      </div>

      <div className="text-center border-t-2 border-gray-300 pt-3 text-xs text-gray-600">
        <p>Obrigado pela preferência!</p>
        <p className="text-xs mt-1">www.creperia.com.br</p>
      </div>
    </div>
  );
}
