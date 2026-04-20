import { useState } from "react";
import { useNavigate } from "react-router";
import { motion } from "motion/react";

export default function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Mock authentication - in production, this would validate against Supabase
    if (password === "admin") {
      localStorage.setItem("authenticated", "true");
      navigate("/vendas");
    } else {
      setError("Senha incorreta");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-orange-50 to-amber-50">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md px-8"
      >
        <div className="bg-white rounded-2xl shadow-xl p-12">
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, duration: 0.3 }}
            className="text-center mb-12"
          >
            <img
              src="/src/imports/logo.png"
              alt="Creperia Mix Sabores"
              className="w-48 h-auto mx-auto mb-4"
            />
            <p className="text-gray-500">Sistema de Gestão</p>
          </motion.div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm text-gray-700 mb-2">
                Senha de acesso
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setError("");
                }}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none transition-all"
                placeholder="Digite sua senha"
                autoFocus
              />
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-red-500 text-sm mt-2"
                >
                  {error}
                </motion.p>
              )}
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-gradient-to-r from-orange-600 to-orange-700 text-white py-3 rounded-lg hover:shadow-lg transition-all"
            >
              Entrar
            </motion.button>
          </form>

          <div className="mt-8 text-center text-sm text-gray-500">
            <p>Senha padrão: admin</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
