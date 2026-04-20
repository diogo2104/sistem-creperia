import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit, Trash2, AlertTriangle, X } from "lucide-react";

interface ItemEstoque {
  id: number;
  nome: string;
  categoria: "Ingredientes" | "Recheios" | "Recheios Doces" | "Embalagens" | "Adicionais" | "Bebidas";
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
  { id: 11, nome: "Queijo Extra", categoria: "Adicionais", quantidade: 5, unidade: "kg", estoqueMinimo: 3, preco: 35.00 },
  { id: 12, nome: "Bacon", categoria: "Adicionais", quantidade: 4, unidade: "kg", estoqueMinimo: 2, preco: 28.00 },
  { id: 13, nome: "Coca-Cola 2L", categoria: "Bebidas", quantidade: 24, unidade: "un", estoqueMinimo: 12, preco: 8.50 },
  { id: 14, nome: "Suco de Laranja 1L", categoria: "Bebidas", quantidade: 15, unidade: "un", estoqueMinimo: 10, preco: 6.50 },
];

export default function EstoqueNovo() {
  const [estoque, setEstoque] = useState<ItemEstoque[]>(estoqueMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState("Todos");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [itemEditando, setItemEditando] = useState<ItemEstoque | null>(null);

  const categorias = ["Todos", "Ingredientes", "Recheios", "Recheios Doces", "Embalagens", "Adicionais", "Bebidas"];

  const estoqueEmBaixa = estoque.filter(item => item.quantidade <= item.estoqueMinimo);

  const estoqueFiltrado = estoque.filter(item => {
    const matchSearch = item.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === "Todos" || item.categoria === categoriaFiltro;
    return matchSearch && matchCategoria;
  });

  const valorTotalEstoque = estoque.reduce((total, item) => total + (item.preco * item.quantidade), 0);

  const abrirModalNovo = () => {
    setItemEditando(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = (item: ItemEstoque) => {
    setItemEditando(item);
    setMostrarModal(true);
  };

  const excluirItem = (id: number) => {
    if (confirm("Deseja realmente excluir este item?")) {
      setEstoque(estoque.filter(item => item.id !== id));
    }
  };

  const salvarItem = (item: ItemEstoque) => {
    if (itemEditando) {
      setEstoque(estoque.map(e => e.id === item.id ? item : e));
    } else {
      setEstoque([...estoque, { ...item, id: estoque.length + 1 }]);
    }
    setMostrarModal(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Controle de Estoque</h1>
          <p className="text-gray-600">Gerencie ingredientes, recheios, bebidas e materiais</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={abrirModalNovo}
          className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
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
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gradient-to-r from-orange-600 to-orange-700 text-white">
            <tr>
              <th className="text-left px-6 py-4 text-sm">Item</th>
              <th className="text-left px-6 py-4 text-sm">Categoria</th>
              <th className="text-left px-6 py-4 text-sm">Quantidade</th>
              <th className="text-left px-6 py-4 text-sm">Estoque Mínimo</th>
              <th className="text-left px-6 py-4 text-sm">Preço Unit.</th>
              <th className="text-left px-6 py-4 text-sm">Valor Total</th>
              <th className="text-right px-6 py-4 text-sm">Ações</th>
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
                  <td className="px-6 py-4">
                    <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                      {item.categoria}
                    </span>
                  </td>
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
                      <button
                        onClick={() => abrirModalEditar(item)}
                        className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                      >
                        <Edit size={18} />
                      </button>
                      <button
                        onClick={() => excluirItem(item.id)}
                        className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      >
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

      {/* Modal de Item */}
      <AnimatePresence>
        {mostrarModal && (
          <ModalItem
            item={itemEditando}
            onClose={() => setMostrarModal(false)}
            onSave={salvarItem}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface ModalItemProps {
  item: ItemEstoque | null;
  onClose: () => void;
  onSave: (item: ItemEstoque) => void;
}

function ModalItem({ item, onClose, onSave }: ModalItemProps) {
  const [formData, setFormData] = useState<ItemEstoque>(
    item || {
      id: 0,
      nome: "",
      categoria: "Ingredientes",
      quantidade: 0,
      unidade: "kg",
      estoqueMinimo: 0,
      preco: 0,
    }
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl text-gray-900">
            {item ? "Editar Item" : "Novo Item de Estoque"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-2">Nome do Item *</label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Ex: Farinha de Trigo"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Categoria *</label>
              <select
                required
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
              >
                <option value="Ingredientes">Ingredientes</option>
                <option value="Recheios">Recheios</option>
                <option value="Recheios Doces">Recheios Doces</option>
                <option value="Embalagens">Embalagens</option>
                <option value="Adicionais">Adicionais</option>
                <option value="Bebidas">Bebidas</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Unidade *</label>
              <select
                value={formData.unidade}
                onChange={(e) => setFormData({ ...formData, unidade: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
              >
                <option value="kg">Quilograma (kg)</option>
                <option value="L">Litro (L)</option>
                <option value="un">Unidade (un)</option>
                <option value="g">Grama (g)</option>
                <option value="ml">Mililitro (ml)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Quantidade Atual *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.quantidade}
                onChange={(e) => setFormData({ ...formData, quantidade: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="0"
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Estoque Mínimo *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.estoqueMinimo}
                onChange={(e) => setFormData({ ...formData, estoqueMinimo: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="0"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-2">Preço Unitário (R$) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.preco}
                onChange={(e) => setFormData({ ...formData, preco: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="0.00"
              />
            </div>
          </div>

          {formData.quantidade > 0 && formData.preco > 0 && (
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-sm text-gray-700">
                Valor Total em Estoque: <span className="text-gray-900">R$ {(formData.quantidade * formData.preco).toFixed(2)}</span>
              </p>
              {formData.quantidade <= formData.estoqueMinimo && (
                <p className="text-sm text-orange-600 mt-1 flex items-center gap-1">
                  <AlertTriangle size={14} />
                  Estoque abaixo do mínimo!
                </p>
              )}
            </div>
          )}

          <div className="flex gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-orange-600 to-orange-700 text-white rounded-lg hover:shadow-lg transition-all"
            >
              {item ? "Salvar Alterações" : "Adicionar Item"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
