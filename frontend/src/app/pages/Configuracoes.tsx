import { motion } from "motion/react";
import { Save, Bell, Lock, Palette, Database, Printer } from "lucide-react";

export default function Configuracoes() {
  return (
    <div className="p-4 md:p-6 space-y-4 md:space-y-6">
      <div>
        <h1 className="text-3xl text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-600">Configure as preferências do sistema</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
        {/* Notificações */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <Bell className="text-orange-600" size={24} />
            <h2 className="text-xl text-gray-900">Notificações</h2>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Alertas de estoque baixo</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-700">Novos pedidos</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-700">Relatórios diários</span>
              <input
                type="checkbox"
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-700">Metas de vendas</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
            </label>
          </div>
        </div>

        {/* Backup e Dados */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <Database className="text-orange-600" size={24} />
            <h2 className="text-xl text-gray-900">Backup e Dados</h2>
          </div>

          <div className="space-y-4">
            <button className="w-full px-4 py-3 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors">
              Fazer Backup Agora
            </button>

            <div className="p-4 bg-gray-50 rounded-lg">
              <p className="text-sm text-gray-600 mb-1">Último backup</p>
              <p className="text-gray-900">Hoje às 03:00</p>
            </div>

            <label className="flex items-center justify-between">
              <span className="text-gray-700">Backup automático diário</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
            </label>
          </div>
        </div>

        {/* Impressão */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <Printer className="text-orange-600" size={24} />
            <h2 className="text-xl text-gray-900">Impressão</h2>
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">Impressora Padrão</label>
            <select className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent outline-none bg-white">
              <option>Impressora Térmica - Pedidos</option>
              <option>HP LaserJet - Relatórios</option>
              <option>Nenhuma</option>
            </select>
          </div>

          <div className="space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-700">Imprimir pedidos automaticamente</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-700">Imprimir comprovante de pagamento</span>
              <input
                type="checkbox"
                defaultChecked
                className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500"
              />
            </label>
          </div>
        </div>

        {/* Sistema */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 space-y-6">
          <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
            <Database className="text-orange-600" size={24} />
            <h2 className="text-xl text-gray-900">Informações do Sistema</h2>
          </div>

          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Versão</span>
              <span className="text-gray-900">1.0.0</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Última atualização</span>
              <span className="text-gray-900">09/04/2026</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Banco de dados</span>
              <span className="text-orange-600">Aguardando conexão Supabase</span>
            </div>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <p className="text-sm text-gray-500">
              Para habilitar sincronização de dados e acesso multiplataforma, conecte ao Supabase nas configurações do Make.
            </p>
          </div>
        </div>
      </div>

      {/* Botão Salvar */}
      <div className="flex justify-end">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="bg-gradient-to-r from-orange-600 to-orange-700 text-white px-8 py-3 rounded-lg hover:shadow-lg transition-all flex items-center gap-2"
        >
          <Save size={20} />
          Salvar Configurações
        </motion.button>
      </div>
    </div>
  );
}
