import { createBrowserRouter } from "react-router";
import Login from "./pages/Login";
import MainLayout from "./components/MainLayout";
import Vendas from "./pages/Vendas";
import Produtos from "./pages/Produtos";
import EstoqueNovo from "./pages/EstoqueNovo";
import Relatorios from "./pages/Relatorios";
import Usuarios from "./pages/Usuarios";
import Configuracoes from "./pages/Configuracoes";

export const router = createBrowserRouter([
  {
    path: "/login",
    Component: Login,
  },
  {
    path: "/",
    Component: MainLayout,
    children: [
      { index: true, Component: Vendas },
      { path: "vendas", Component: Vendas },
      { path: "produtos", Component: Produtos },
      { path: "estoque", Component: EstoqueNovo },
      { path: "relatorios", Component: Relatorios },
      { path: "usuarios", Component: Usuarios },
      { path: "configuracoes", Component: Configuracoes },
    ],
  },
]);
