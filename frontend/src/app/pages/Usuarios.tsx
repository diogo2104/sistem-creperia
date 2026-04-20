import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Plus, Search, Edit, Trash2, UserCheck, UserX, X, Eye } from "lucide-react";

interface Usuario {
  id: number;
  nome: string;
  email: string;
  funcao: string;
  status: "ativo" | "inativo";
  vendasRealizadas: number;
  receitaGerada: number;
}

const usuariosMock: Usuario[] = [
  { id: 1, nome: "Ana Silva", email: "ana@creperia.com", funcao: "Vendedor", status: "ativo", vendasRealizadas: 186, receitaGerada: 3650 },
  { id: 2, nome: "João Santos", email: "joao@creperia.com", funcao: "Vendedor", status: "ativo", vendasRealizadas: 154, receitaGerada: 3020 },
  { id: 3, nome: "Maria Costa", email: "maria@creperia.com", funcao: "Vendedor", status: "ativo", vendasRealizadas: 142, receitaGerada: 2780 },
  { id: 4, nome: "Pedro Oliveira", email: "pedro@creperia.com", funcao: "Gerente", status: "ativo", vendasRealizadas: 118, receitaGerada: 2310 },
  { id: 5, nome: "Carlos Souza", email: "carlos@creperia.com", funcao: "Vendedor", status: "inativo", vendasRealizadas: 45, receitaGerada: 890 },
];

export default function Usuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>(usuariosMock);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFiltro, setStatusFiltro] = useState<"todos" | "ativo" | "inativo">("todos");
  const [usuarioEditando, setUsuarioEditando] = useState<Usuario | null>(null);
  const [mostrarModal, setMostrarModal] = useState(false);
  const [usuarioDetalhes, setUsuarioDetalhes] = useState<Usuario | null>(null);

  const usuariosFiltrados = usuarios.filter(usuario => {
    const matchSearch = usuario.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
                       usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchStatus = statusFiltro === "todos" || usuario.status === statusFiltro;
    return matchSearch && matchStatus;
  });

  const usuariosAtivos = usuarios.filter(u => u.status === "ativo").length;
  const totalVendas = usuarios.reduce((acc, u) => acc + u.vendasRealizadas, 0);
  const totalReceita = usuarios.reduce((acc, u) => acc + u.receitaGerada, 0);

  const toggleStatus = (id: number) => {
    setUsuarios(usuarios.map(usuario =>
      usuario.id === id
        ? { ...usuario, status: usuario.status === "ativo" ? "inativo" : "ativo" }
        : usuario
    ));
  };

  const abrirModalNovo = () => {
    setUsuarioEditando(null);
    setMostrarModal(true);
  };

  const abrirModalEditar = (usuario: Usuario) => {
    setUsuarioEditando(usuario);
    setMostrarModal(true);
  };

  const excluirUsuario = (id: number) => {
    if (confirm("Deseja realmente excluir este usuário?")) {
      setUsuarios(usuarios.filter(u => u.id !== id));
    }
  };

  const salvarUsuario = (usuario: Usuario) => {
    if (usuarioEditando) {
      setUsuarios(usuarios.map(u => u.id === usuario.id ? usuario : u));
    } else {
      setUsuarios([...usuarios, { ...usuario, id: usuarios.length + 1 }]);
    }
    setMostrarModal(false);
  };

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Usuários</h1>
          <p className="text-gray-600">Gerencie vendedores e colaboradores</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={abrirModalNovo}
          className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Plus size={20} />
          Novo Usuário
        </motion.button>
      </div>

      {/* Cards de Resumo */}
      <div className="grid grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-600 mb-2">Usuários Ativos</p>
          <p className="text-3xl text-gray-900">{usuariosAtivos}</p>
          <p className="text-sm text-gray-500 mt-1">de {usuarios.length} total</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-600 mb-2">Total de Vendas</p>
          <p className="text-3xl text-gray-900">{totalVendas}</p>
          <p className="text-sm text-gray-500 mt-1">todos os usuários</p>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <p className="text-gray-600 mb-2">Receita Gerada</p>
          <p className="text-3xl text-gray-900">R$ {totalReceita.toFixed(2)}</p>
          <p className="text-sm text-gray-500 mt-1">todos os usuários</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Buscar usuário..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none"
          />
        </div>
        <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
          <button
            onClick={() => setStatusFiltro("todos")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFiltro === "todos"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Todos
          </button>
          <button
            onClick={() => setStatusFiltro("ativo")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFiltro === "ativo"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Ativos
          </button>
          <button
            onClick={() => setStatusFiltro("inativo")}
            className={`px-4 py-2 rounded-lg transition-colors ${
              statusFiltro === "inativo"
                ? "bg-white text-gray-900 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Inativos
          </button>
        </div>
      </div>

      {/* Lista de Usuários */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden overflow-x-auto">
        <table className="w-full min-w-[800px]">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Usuário</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Email</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Função</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Vendas</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Receita</th>
              <th className="text-left px-6 py-4 text-sm text-gray-600">Status</th>
              <th className="text-right px-6 py-4 text-sm text-gray-600">Ações</th>
            </tr>
          </thead>
          <tbody>
            {usuariosFiltrados.map((usuario) => (
              <motion.tr
                key={usuario.id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-gray-100 hover:bg-gray-50"
              >
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                      <span className="text-orange-600">
                        {usuario.nome.split(" ").map(n => n[0]).join("")}
                      </span>
                    </div>
                    <span className="text-gray-900">{usuario.nome}</span>
                  </div>
                </td>
                <td className="px-6 py-4 text-gray-600">{usuario.email}</td>
                <td className="px-6 py-4">
                  <span className={`px-3 py-1 rounded-full text-sm ${
                    usuario.funcao === "Gerente"
                      ? "bg-purple-100 text-purple-700"
                      : "bg-blue-100 text-blue-700"
                  }`}>
                    {usuario.funcao}
                  </span>
                </td>
                <td className="px-6 py-4 text-gray-900">{usuario.vendasRealizadas}</td>
                <td className="px-6 py-4 text-gray-900">R$ {usuario.receitaGerada.toFixed(2)}</td>
                <td className="px-6 py-4">
                  <button
                    onClick={() => toggleStatus(usuario.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded-full text-sm ${
                      usuario.status === "ativo"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-700"
                    }`}
                  >
                    {usuario.status === "ativo" ? (
                      <>
                        <UserCheck size={14} />
                        Ativo
                      </>
                    ) : (
                      <>
                        <UserX size={14} />
                        Inativo
                      </>
                    )}
                  </button>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setUsuarioDetalhes(usuario)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Ver detalhes"
                    >
                      <Eye size={18} />
                    </button>
                    <button
                      onClick={() => abrirModalEditar(usuario)}
                      className="p-2 text-orange-600 hover:bg-orange-50 rounded transition-colors"
                      title="Editar"
                    >
                      <Edit size={18} />
                    </button>
                    <button
                      onClick={() => excluirUsuario(usuario.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Excluir"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Edição/Criação */}
      <AnimatePresence>
        {mostrarModal && (
          <ModalUsuario
            usuario={usuarioEditando}
            onClose={() => setMostrarModal(false)}
            onSave={salvarUsuario}
          />
        )}
      </AnimatePresence>

      {/* Modal de Detalhes */}
      <AnimatePresence>
        {usuarioDetalhes && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white rounded-xl p-8 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
            >
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-2xl text-gray-900">Ficha de Vendas - {usuarioDetalhes.nome}</h3>
                <button
                  onClick={() => setUsuarioDetalhes(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-6 mb-6">
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Total de Vendas</p>
                  <p className="text-3xl text-orange-600">{usuarioDetalhes.vendasRealizadas}</p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Receita Gerada</p>
                  <p className="text-3xl text-green-600">R$ {usuarioDetalhes.receitaGerada.toFixed(2)}</p>
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="text-lg text-gray-900">Informações</h4>
                <div className="space-y-2">
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Email:</span>
                    <span className="text-gray-900">{usuarioDetalhes.email}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Função:</span>
                    <span className="text-gray-900">{usuarioDetalhes.funcao}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Status:</span>
                    <span className={`${usuarioDetalhes.status === "ativo" ? "text-green-600" : "text-gray-600"}`}>
                      {usuarioDetalhes.status === "ativo" ? "Ativo" : "Inativo"}
                    </span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-gray-100">
                    <span className="text-gray-600">Ticket Médio:</span>
                    <span className="text-gray-900">
                      R$ {(usuarioDetalhes.receitaGerada / usuarioDetalhes.vendasRealizadas).toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>

              <button
                onClick={() => setUsuarioDetalhes(null)}
                className="w-full mt-6 px-4 py-3 bg-gray-200 text-gray-900 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Fechar
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

interface ModalUsuarioProps {
  usuario: Usuario | null;
  onClose: () => void;
  onSave: (usuario: Usuario) => void;
}

function ModalUsuario({ usuario, onClose, onSave }: ModalUsuarioProps) {
  const [formData, setFormData] = useState<Usuario>(
    usuario || {
      id: 0,
      nome: "",
      email: "",
      funcao: "Vendedor",
      status: "ativo",
      vendasRealizadas: 0,
      receitaGerada: 0,
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
        className="bg-white rounded-xl p-8 max-w-md w-full mx-4"
      >
        <div className="flex justify-between items-start mb-6">
          <h3 className="text-2xl text-gray-900">
            {usuario ? "Editar Usuário" : "Novo Usuário"}
          </h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm text-gray-700 mb-2">Nome *</label>
            <input
              type="text"
              required
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="Nome completo"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Email *</label>
            <input
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none"
              placeholder="email@exemplo.com"
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Função *</label>
            <select
              value={formData.funcao}
              onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
            >
              <option value="Vendedor">Vendedor</option>
              <option value="Gerente">Gerente</option>
              <option value="Caixa">Caixa</option>
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Status *</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
              className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none bg-white"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>

          <div className="flex gap-3 pt-4">
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
              {usuario ? "Salvar" : "Criar"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
