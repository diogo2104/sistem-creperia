import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit, Trash2, X } from "lucide-react";

interface Adicional {
  id: number;
  nome: string;
  preco: number;
}

interface Produto {
  id: number;
  nome: string;
  descricao: string;
  categoria: "Crepes Salgados" | "Crepes Doces" | "Churros" | "Bebidas" | "Adicionais";
  preco: number;
  custo: number;
  status: "ativo" | "inativo";
  imagem?: string;
}

const produtosMock: Produto[] = [
  { id: 1, nome: "Crepe de Frango", descricao: "Frango desfiado com catupiry", categoria: "Crepes Salgados", preco: 18.90, custo: 8.50, status: "ativo" },
  { id: 2, nome: "Crepe de Carne", descricao: "Carne moída temperada", categoria: "Crepes Salgados", preco: 20.90, custo: 9.50, status: "ativo" },
  { id: 3, nome: "Crepe de Nutella", descricao: "Nutella com morango", categoria: "Crepes Doces", preco: 16.90, custo: 7.00, status: "ativo" },
  { id: 4, nome: "Churros Tradicional", descricao: "Churros com doce de leite", categoria: "Churros", preco: 12.90, custo: 5.50, status: "ativo" },
  { id: 5, nome: "Coca-Cola 350ml", descricao: "Refrigerante lata", categoria: "Bebidas", preco: 5.00, custo: 2.50, status: "ativo" },
  { id: 6, nome: "Queijo Extra", descricao: "Porção adicional de queijo", categoria: "Adicionais", preco: 3.00, custo: 1.50, status: "ativo" },
  { id: 7, nome: "Bacon", descricao: "Bacon crocante", categoria: "Adicionais", preco: 4.00, custo: 2.00, status: "ativo" },
];

export default function Produtos() {
  const [produtos, setProdutos] = useState<Produto[]>(produtosMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoriaFiltro, setCategoriaFiltro] = useState<string>("Todos");
  const [mostrarModal, setMostrarModal] = useState(false);
  const [produtoEditando, setProdutoEditando] = useState<Produto | null>(null);

  const categorias = ["Todos", "Crepes Salgados", "Crepes Doces", "Churros", "Bebidas", "Adicionais"];

  const produtosFiltrados = produtos.filter(produto => {
    const matchSearch = produto.nome.toLowerCase().includes(searchTerm.toLowerCase());
    const matchCategoria = categoriaFiltro === "Todos" || produto.categoria === categoriaFiltro;
    return matchSearch && matchCategoria;
  });

  const abrirModalNovo = () => {
    setProdutoEditando(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = (produto: Produto) => {
    setProdutoEditando(produto);
    setMostrarModal(true);
  };

  const excluirProduto = (id: number) => {
    if (confirm("Deseja realmente excluir este produto?")) {
      setProdutos(produtos.filter(p => p.id !== id));
    }
  };

  const salvarProduto = (produto: Produto) => {
    if (produtoEditando) {
      setProdutos(produtos.map(p => p.id === produto.id ? produto : p));
    } else {
      setProdutos([...produtos, { ...produto, id: produtos.length + 1 }]);
    }
    setMostrarModal(false);
  };

  const produtosAtivos = produtos.filter(p => p.status === "ativo").length;
  const valorTotalEstoque = produtos.reduce((total, p) => total + p.preco, 0);

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Produtos</h1>
          <p className="text-gray-600">Gerencie crepes, churros, bebidas e adicionais</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={abrirModalNovo}
          className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Produto
        </motion.button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-600 mb-2">Total de Produtos</p>
          <p className="text-3xl text-gray-900">{produtos.length}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-600 mb-2">Produtos Ativos</p>
          <p className="text-3xl text-orange-600">{produtosAtivos}</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-600 mb-2">Categorias</p>
          <p className="text-3xl text-gray-900">{categorias.length - 1}</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar produto..."
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

      {/* Grid de Produtos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-4">
        {produtosFiltrados.map((produto) => (
          <motion.div
            key={produto.id}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className={`bg-white p-6 rounded-xl border-2 transition-all ${
              produto.status === "ativo" ? "border-gray-200" : "border-gray-300 opacity-60"
            }`}
          >
            <div className="mb-4">
              <div className="flex justify-between items-start mb-2">
                <span className="text-xs bg-orange-100 text-orange-700 px-2 py-1 rounded">
                  {produto.categoria}
                </span>
                <span className={`text-xs px-2 py-1 rounded ${
                  produto.status === "ativo" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                }`}>
                  {produto.status}
                </span>
              </div>
              <h3 className="text-lg text-gray-900 mb-1">{produto.nome}</h3>
              <p className="text-sm text-gray-500">{produto.descricao}</p>
            </div>

            <div className="mb-4 space-y-1">
              <div className="flex justify-between text-sm">
                <span className="text-gray-600">Preço:</span>
                <span className="text-gray-900">R$ {produto.preco.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-2">
              <button
                onClick={() => abrirModalEditar(produto)}
                className="flex-1 p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors flex items-center justify-center gap-1"
              >
                <Edit size={16} />
                Editar
              </button>
              <button
                onClick={() => excluirProduto(produto.id)}
                className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Modal de Produto */}
      <AnimatePresence>
        {mostrarModal && (
          <ModalProduto
            produto={produtoEditando}
            onClose={() => setMostrarModal(false)}
            onSave={salvarProduto}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

interface ModalProdutoProps {
  produto: Produto | null;
  onClose: () => void;
  onSave: (produto: Produto) => void;
}

function ModalProduto({ produto, onClose, onSave }: ModalProdutoProps) {
  const [formData, setFormData] = useState<Produto>(
    produto || {
      id: 0,
      nome: "",
      descricao: "",
      categoria: "Crepes Salgados",
      preco: 0,
      custo: 0,
      status: "ativo",
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
            {produto ? "Editar Produto" : "Novo Produto"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-2">Nome do Produto *</label>
              <input
                type="text"
                required
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Ex: Crepe de Frango"
              />
            </div>

            <div className="col-span-2">
              <label className="block text-sm text-gray-700 mb-2">Descrição</label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Ex: Frango desfiado com catupiry"
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Categoria *</label>
              <input
                type="text"
                required
                list="categorias"
                value={formData.categoria}
                onChange={(e) => setFormData({ ...formData, categoria: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="Digite ou selecione"
              />
              <datalist id="categorias">
                <option value="Crepes Salgados" />
                <option value="Crepes Doces" />
                <option value="Churros" />
                <option value="Bebidas" />
                <option value="Adicionais" />
              </datalist>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Status *</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white"
              >
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>

            <div>
              <label className="block text-sm text-gray-700 mb-2">Preço de Venda (R$) *</label>
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

            <div>
              <label className="block text-sm text-gray-700 mb-2">Custo (R$) *</label>
              <input
                type="number"
                step="0.01"
                required
                value={formData.custo}
                onChange={(e) => setFormData({ ...formData, custo: parseFloat(e.target.value) || 0 })}
                className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
                placeholder="0.00"
              />
            </div>
          </div>


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
              {produto ? "Salvar Alterações" : "Criar Produto"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
