import { motion } from "motion/react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { TrendingUp, DollarSign, ShoppingBag, Users, Download, Calendar } from "lucide-react";

const vendasPorDia = [
  { dia: "Seg", vendas: 45, valor: 890 },
  { dia: "Ter", vendas: 52, valor: 1040 },
  { dia: "Qua", vendas: 48, valor: 950 },
  { dia: "Qui", vendas: 61, valor: 1220 },
  { dia: "Sex", vendas: 75, valor: 1480 },
  { dia: "Sáb", vendas: 89, valor: 1750 },
  { dia: "Dom", vendas: 67, valor: 1310 },
];

const produtosMaisVendidos = [
  { nome: "Crepe de Frango", quantidade: 145, valor: 2740.5 },
  { nome: "Crepe de Nutella", quantidade: 128, valor: 2163.2 },
  { nome: "Crepe de Carne", quantidade: 98, valor: 2048.2 },
  { nome: "Crepe 4 Queijos", quantidade: 87, valor: 1731.3 },
  { nome: "Crepe de Morango", quantidade: 76, valor: 1360.4 },
];

const vendasPorCategoria = [
  { categoria: "Salgados", valor: 8920, cor: "#fb923c" },
  { categoria: "Doces", valor: 5640, cor: "#fdba74" },
];

const vendedoresDesempenho = [
  { vendedor: "Ana Silva", vendas: 186, valor: 3650 },
  { vendedor: "João Santos", vendas: 154, valor: 3020 },
  { vendedor: "Maria Costa", vendas: 142, valor: 2780 },
  { vendedor: "Pedro Oliveira", vendas: 118, valor: 2310 },
];

export default function Relatorios() {
  const totalVendas = vendasPorDia.reduce((acc, dia) => acc + dia.vendas, 0);
  const totalReceita = vendasPorDia.reduce((acc, dia) => acc + dia.valor, 0);
  const ticketMedio = totalReceita / totalVendas;
  const crescimento = 12.5;

  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl text-gray-900 mb-2">Relatórios e Dashboard</h1>
          <p className="text-gray-600">Análise completa do desempenho da creperia</p>
        </div>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-6 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Download size={20} />
          Exportar Relatório
        </motion.button>
      </div>

      {/* Filtro de Período */}
      <div className="bg-white p-4 rounded-xl border border-gray-200 flex items-center gap-4">
        <Calendar size={20} className="text-gray-600" />
        <span className="text-gray-700">Período:</span>
        <select className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 outline-none">
          <option>Última semana</option>
          <option>Último mês</option>
          <option>Últimos 3 meses</option>
          <option>Este ano</option>
        </select>
      </div>

      {/* KPIs Principais */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-orange-100 rounded-lg">
              <DollarSign className="text-orange-600" size={24} />
            </div>
            <span className="text-green-600 text-sm flex items-center gap-1">
              <TrendingUp size={16} />
              +{crescimento}%
            </span>
          </div>
          <p className="text-gray-600 mb-1">Receita Total</p>
          <p className="text-3xl text-gray-900">R$ {totalReceita.toFixed(2)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <ShoppingBag className="text-blue-600" size={24} />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Total de Vendas</p>
          <p className="text-3xl text-gray-900">{totalVendas}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-green-100 rounded-lg">
              <TrendingUp className="text-green-600" size={24} />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Ticket Médio</p>
          <p className="text-3xl text-gray-900">R$ {ticketMedio.toFixed(2)}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white p-6 rounded-xl border border-gray-200"
        >
          <div className="flex items-start justify-between mb-4">
            <div className="p-3 bg-purple-100 rounded-lg">
              <Users className="text-purple-600" size={24} />
            </div>
          </div>
          <p className="text-gray-600 mb-1">Produtos Vendidos</p>
          <p className="text-3xl text-gray-900">{produtosMaisVendidos.length}</p>
        </motion.div>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Vendas por Dia */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg text-gray-900 mb-6">Vendas por Dia da Semana</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={vendasPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="vendas" fill="#fb923c" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Receita por Dia */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg text-gray-900 mb-6">Receita por Dia (R$)</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={vendasPorDia}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="dia" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#fff",
                  border: "1px solid #e5e5e5",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="valor"
                stroke="#fb923c"
                strokeWidth={3}
                dot={{ fill: "#fb923c", r: 6 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-6">
        {/* Vendas por Categoria */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg text-gray-900 mb-6">Vendas por Categoria</h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={vendasPorCategoria}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ categoria, valor }) => `${categoria}: R$ ${valor}`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="valor"
              >
                {vendasPorCategoria.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.cor} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Produtos Mais Vendidos */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h3 className="text-lg text-gray-900 mb-6">Produtos Mais Vendidos</h3>
          <div className="space-y-4">
            {produtosMaisVendidos.map((produto, index) => (
              <div key={produto.nome} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-gray-900">{produto.nome}</span>
                  <span className="text-gray-600">{produto.quantidade} vendas</span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-gray-100 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-orange-600 h-full rounded-full"
                      style={{
                        width: `${(produto.quantidade / produtosMaisVendidos[0].quantidade) * 100}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm text-gray-600 min-w-[100px] text-right">
                    R$ {produto.valor.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Desempenho dos Vendedores */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <h3 className="text-lg text-gray-900 mb-6">Desempenho dos Vendedores</h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="border-b border-gray-200">
              <tr>
                <th className="text-left px-4 py-3 text-sm text-gray-600">Posição</th>
                <th className="text-left px-4 py-3 text-sm text-gray-600">Vendedor</th>
                <th className="text-left px-4 py-3 text-sm text-gray-600">Vendas</th>
                <th className="text-left px-4 py-3 text-sm text-gray-600">Receita</th>
                <th className="text-left px-4 py-3 text-sm text-gray-600">Ticket Médio</th>
              </tr>
            </thead>
            <tbody>
              {vendedoresDesempenho.map((vendedor, index) => (
                <tr key={vendedor.vendedor} className="border-b border-gray-100">
                  <td className="px-4 py-4">
                    <span
                      className={`inline-flex items-center justify-center w-8 h-8 rounded-full ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-700"
                          : index === 1
                          ? "bg-gray-100 text-gray-700"
                          : index === 2
                          ? "bg-orange-100 text-orange-700"
                          : "bg-gray-50 text-gray-600"
                      }`}
                    >
                      {index + 1}º
                    </span>
                  </td>
                  <td className="px-4 py-4 text-gray-900">{vendedor.vendedor}</td>
                  <td className="px-4 py-4 text-gray-600">{vendedor.vendas}</td>
                  <td className="px-4 py-4 text-gray-900">R$ {vendedor.valor.toFixed(2)}</td>
                  <td className="px-4 py-4 text-gray-600">
                    R$ {(vendedor.valor / vendedor.vendas).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
