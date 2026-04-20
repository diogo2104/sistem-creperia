Rails.application.routes.draw do
  post '/auth/login', to: 'auth#login'

  resources :usuarios
  resources :categorias
  resources :produtos
  resources :pedidos do
    member do
      patch :finalizar
      patch :cancelar
    end

    resources :pedido_itens
    resources :pagamentos
  end

  resources :movimentacoes_estoque

  get '/dashboard', to: 'dashboard#index'
end