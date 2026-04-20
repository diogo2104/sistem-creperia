import { Link, useLocation, useNavigate } from "react-router";
import { ShoppingCart, Package, BarChart3, Users, Settings, LogOut, UtensilsCrossed } from "lucide-react";
import { motion } from "motion/react";

const menuItems = [
  { path: "/vendas", icon: ShoppingCart, label: "Vendas" },
  { path: "/produtos", icon: UtensilsCrossed, label: "Produtos" },
  { path: "/estoque", icon: Package, label: "Controle de Estoque" },
  { path: "/relatorios", icon: BarChart3, label: "Relatórios" },
  { path: "/usuarios", icon: Users, label: "Usuários" },
  { path: "/configuracoes", icon: Settings, label: "Configurações" },
];

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("authenticated");
    navigate("/login");
  };

  return (
    <aside className="w-full md:w-72 bg-white border-r border-gray-200 flex flex-col md:h-screen">
      <div className="p-6 border-b border-gray-200 bg-black">
        <div className="flex flex-col items-center gap-3">
          <img
            src="/src/imports/logo.png"
            alt="Creperia Mix Sabores"
            className="w-40 h-40 rounded-full object-cover"
          />
          <p className="text-xs text-orange-400 text-center">Sistema de Gestão</p>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            const Icon = item.icon;

            return (
              <li key={item.path}>
                <Link to={item.path}>
                  <motion.div
                    whileHover={{ x: 4 }}
                    className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                      isActive
                        ? "bg-gradient-to-r from-orange-600 to-orange-700 text-white shadow-lg"
                        : "text-gray-700 hover:bg-gray-50"
                    }`}
                  >
                    <Icon size={20} />
                    <span>{item.label}</span>
                  </motion.div>
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-200">
        <motion.button
          whileHover={{ x: 4 }}
          onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-lg text-gray-700 hover:bg-gray-50 w-full transition-colors"
        >
          <LogOut size={20} />
          <span>Sair</span>
        </motion.button>
      </div>
    </aside>
  );
}
