import { useState } from "react";
import { motion } from "motion/react";
import { Plus, Search, Edit, Trash2, AlertTriangle } from "lucide-react";

interface ItemEstoque {
  id: number;
  nome: string;
  categoria: string;
  quantidade: number;
  unidade: string;
  estoqueMinimo: number;
  preco: number;
}

const estoqueMock: ItemEstoque[] = [
  { id: 1, nome: "Farinha de Trigo", categoria: "Ingredientes", quantidade: 25, unidade: "kg", estoqueMinimo: 10, preco: 5.90 },
  { id: 2, nome: "Leite", categoria: "Ingredientes", quantidade: 15, unidade: "L", estoqueMinimo: 10, preco: 4.50 },
  { id: 3, nome: "Ovos", categoria: "Ingredientes", quantidade: 200, unidade: "un", estoqueMinimo: 100, preco: 0.80 },
  { id: 4, nome: "Queijo Mussarela", categoria: "Recheios", quantidade: 8, unidade: "kg", estoqueMinimo: 5, preco: 35.00 },
  { id: 5, nome: "Presunto", categoria: "Recheios", quantidade: 6, unidade: "kg", estoqueMinimo: 5, preco: 28.00 },
  { id: 6, nome: "Frango Desfiado", categoria: "Recheios", quantidade: 4, unidade: "kg", estoqueMinimo: 3, preco: 22.00 },
  { id: 7, nome: "Nutella", categoria: "Recheios Doces", quantidade: 2, unidade: "kg", estoqueMinimo: 2, preco: 45.00 },
  { id: 8, nome: "Morango", categoria: "Recheios Doces", quantidade: 3, unidade: "kg", estoqueMinimo: 2, preco: 18.00 },
  { id: 9, nome: "Embalagem Pequena", categoria: "Embalagens", quantidade: 150, unidade: "un", estoqueMinimo: 100, preco: 0.50 },
  { id: 10, nome: "Embalagem Grande", categoria: "Embalagens", quantidade: 80, unidade: "un", estoqueMinimo: 50, preco: 0.80 },
];

export default function Estoque() {
  const [estoque, setEstoque] = useState<ItemEstoque[]>(estoqueMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");

  const categorias = ["Todos", ...Array.from(new Set(estoque.map(item => item.categoria)))];

  const estoqueEmBaixa = estoque.filter(item => item.quantidade <= item.estoqueMinimo);

  const estoqueFiltrado = estoque.filter(item => {
    const matchSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === "Todos" || item.categoria === categoriaFiltro;
    return matchSearch && matchCategoria;
  });

  const valorTotalEstoque = estoque.reduce((total, item) => total + (item.preco * item.quantidade), 0);

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Controle de Estoque</h1>
          <p className="text-gray-600">Gerencie ingredientes, recheios e materiais</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition-colors flex items-center gap-2"
        >
          <Plus size={20} />
          Adicionar Item
        </motion.button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-600 mb-2">Total de Itens</p>
          <p className="text-3xl text-gray-900">{estoque.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-600 mb-2">Valor em Estoque</p>
          <p className="text-3xl text-gray-900">R$ {valorTotalEstoque.toFixed(2)}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-orange-200 bg-orange-50">
          <p className="text-orange-700 mb-2 flex items-center gap-2">
            <AlertTriangle size={20} />
            Itens em Baixa
          </p>
          <p className="text-3xl text-orange-600">{estoqueEmBaixa.length}</p>
        </div>
      </div>

      {/* Alertas de Estoque Baixo */}
      {estoqueEmBaixa.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-orange-50 border border-orange-200 p-4 rounded-lg"
        >
          <div className="flex items-start gap-3">
            <AlertTriangle size={20} className="text-orange-600 mt-0.5" />
            <div>
              <h3 className="text-orange-900 mb-1">Atenção: Itens com estoque baixo</h3>
              <p className="text-sm text-orange-700">
                {estoqueEmBaixa.map(item => item.nome).join(", ")}
              </p>
            </div>
          </div>
        </motion.div>
      )}

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar item..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
        <select
          value={categoriaFiltro}
          onChange={(e) => setCategoriaFiltro(e.target.value)}
          className="px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
        >
          {categorias.map(cat => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* Tabela de Estoque */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Item</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Categoria</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Quantidade</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Estoque Mínimo</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Preço Unit.</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Valor Total</th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {estoqueFiltrado.map((item) => {
              const isLow = item.quantidade <= item.estoqueMinimo;
              return (
                <motion.tr
                  key={item.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className={`border-b border-gray-100 hover:bg-gray-50 ${
                    isLow ? "bg-orange-50" : ""
                  }`}
                >
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                      {isLow && <AlertTriangle size={16} className="text-orange-600" />}
                      <span className="text-gray-900">{item.nome}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-gray-600">{item.categoria}</td>
                  <td className="px-6 py-4">
                    <span className={isLow ? "text-orange-600" : "text-gray-900"}>
                      {item.quantidade} {item.unidade}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-gray-600">
                    {item.estoqueMinimo} {item.unidade}
                  </td>
                  <td className="px-6 py-4 text-gray-600">R$ {item.preco.toFixed(2)}</td>
                  <td className="px-6 py-4 text-gray-900">
                    R$ {(item.preco * item.quantidade).toFixed(2)}
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-600 hover:text-orange-600 hover:bg-orange-50 rounded transition-colors">
                        <Edit size={18} />
                      </button>
                      <button className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
