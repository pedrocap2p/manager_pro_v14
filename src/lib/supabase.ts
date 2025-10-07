import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Tipos para o banco de dados
export interface SupabaseUsuario {
  id: string
  nome: string
  email: string
  senha: string
  tipo: 'admin' | 'usuario'
  ativo: boolean
  data_cadastro: string
  ultimo_acesso: string
  created_at?: string
  updated_at?: string
}

export interface SupabaseCliente {
  id: string
  nome: string
  whatsapp: string
  plano: string
  status: 'ativo' | 'inativo' | 'suspenso' | 'vencido'
  data_vencimento: string
  valor_mensal: number
  data_ultimo_pagamento: string
  observacoes: string
  data_cadastro: string
  usuario_id: string
  created_at?: string
  updated_at?: string
}

export interface SupabaseServidor {
  id: string
  nome: string
  link: string
  descricao: string
  ativo: boolean
  data_criacao: string
  usuario_id: string
  created_at?: string
  updated_at?: string
}

export interface SupabaseBanner {
  id: string
  categoria: 'filme' | 'serie' | 'esporte'
  imagem_url: string
  logo_url: string
  sinopse?: string
  data_evento?: string
  logo_personalizada?: string
  posicao_logo?: 'direita' | 'centro'
  data_criacao: string
  usuario_id: string
  created_at?: string
  updated_at?: string
}

// Funções de inicialização das tabelas
export const initializeTables = async () => {
  try {
    // Criar tabela de usuários
    const { error: usuariosError } = await supabase.rpc('create_usuarios_table')
    if (usuariosError && !usuariosError.message.includes('already exists')) {
      console.log('Criando tabela usuarios via SQL direto...')
    }

    // Criar tabela de clientes
    const { error: clientesError } = await supabase.rpc('create_clientes_table')
    if (clientesError && !clientesError.message.includes('already exists')) {
      console.log('Criando tabela clientes via SQL direto...')
    }

    // Criar tabela de servidores
    const { error: servidoresError } = await supabase.rpc('create_servidores_table')
    if (servidoresError && !servidoresError.message.includes('already exists')) {
      console.log('Criando tabela servidores via SQL direto...')
    }

    // Criar tabela de banners
    const { error: bannersError } = await supabase.rpc('create_banners_table')
    if (bannersError && !bannersError.message.includes('already exists')) {
      console.log('Criando tabela banners via SQL direto...')
    }

    console.log('✅ Tabelas inicializadas no Supabase')
  } catch (error) {
    console.error('❌ Erro ao inicializar tabelas:', error)
  }
}

// Classe para gerenciar dados no Supabase
export class SupabaseAPI {
  // Usuários
  static async salvarUsuario(usuario: SupabaseUsuario): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('usuarios')
        .upsert({
          id: usuario.id,
          nome: usuario.nome,
          email: usuario.email,
          senha: usuario.senha,
          tipo: usuario.tipo,
          ativo: usuario.ativo,
          data_cadastro: usuario.data_cadastro,
          ultimo_acesso: usuario.ultimo_acesso
        })

      if (error) {
        console.error('❌ Erro ao salvar usuário no Supabase:', error)
        return false
      }

      console.log('✅ Usuário salvo no Supabase:', usuario.nome)
      return true
    } catch (error) {
      console.error('❌ Erro ao salvar usuário:', error)
      return false
    }
  }

  static async carregarUsuarios(): Promise<SupabaseUsuario[]> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erro ao carregar usuários do Supabase:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('❌ Erro ao carregar usuários:', error)
      return []
    }
  }

  static async atualizarUsuario(id: string, dados: Partial<SupabaseUsuario>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('usuarios')
        .update(dados)
        .eq('id', id)

      if (error) {
        console.error('❌ Erro ao atualizar usuário no Supabase:', error)
        return false
      }

      console.log('✅ Usuário atualizado no Supabase:', id)
      return true
    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error)
      return false
    }
  }

  static async excluirUsuario(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('usuarios')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Erro ao excluir usuário do Supabase:', error)
        return false
      }

      console.log('✅ Usuário excluído do Supabase:', id)
      return true
    } catch (error) {
      console.error('❌ Erro ao excluir usuário:', error)
      return false
    }
  }

  // Clientes
  static async salvarCliente(cliente: SupabaseCliente): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('clientes')
        .upsert({
          id: cliente.id,
          nome: cliente.nome,
          whatsapp: cliente.whatsapp,
          plano: cliente.plano,
          status: cliente.status,
          data_vencimento: cliente.data_vencimento,
          valor_mensal: cliente.valor_mensal,
          data_ultimo_pagamento: cliente.data_ultimo_pagamento,
          observacoes: cliente.observacoes,
          data_cadastro: cliente.data_cadastro,
          usuario_id: cliente.usuario_id
        })

      if (error) {
        console.error('❌ Erro ao salvar cliente no Supabase:', error)
        return false
      }

      console.log('✅ Cliente salvo no Supabase:', cliente.nome)
      return true
    } catch (error) {
      console.error('❌ Erro ao salvar cliente:', error)
      return false
    }
  }

  static async carregarClientes(): Promise<SupabaseCliente[]> {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erro ao carregar clientes do Supabase:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('❌ Erro ao carregar clientes:', error)
      return []
    }
  }

  static async atualizarCliente(id: string, dados: Partial<SupabaseCliente>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('clientes')
        .update(dados)
        .eq('id', id)

      if (error) {
        console.error('❌ Erro ao atualizar cliente no Supabase:', error)
        return false
      }

      console.log('✅ Cliente atualizado no Supabase:', id)
      return true
    } catch (error) {
      console.error('❌ Erro ao atualizar cliente:', error)
      return false
    }
  }

  static async excluirCliente(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('clientes')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Erro ao excluir cliente do Supabase:', error)
        return false
      }

      console.log('✅ Cliente excluído do Supabase:', id)
      return true
    } catch (error) {
      console.error('❌ Erro ao excluir cliente:', error)
      return false
    }
  }

  // Servidores
  static async salvarServidor(servidor: SupabaseServidor): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('servidores')
        .upsert({
          id: servidor.id,
          nome: servidor.nome,
          link: servidor.link,
          descricao: servidor.descricao,
          ativo: servidor.ativo,
          data_criacao: servidor.data_criacao,
          usuario_id: servidor.usuario_id
        })

      if (error) {
        console.error('❌ Erro ao salvar servidor no Supabase:', error)
        return false
      }

      console.log('✅ Servidor salvo no Supabase:', servidor.nome)
      return true
    } catch (error) {
      console.error('❌ Erro ao salvar servidor:', error)
      return false
    }
  }

  static async carregarServidores(): Promise<SupabaseServidor[]> {
    try {
      const { data, error } = await supabase
        .from('servidores')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erro ao carregar servidores do Supabase:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('❌ Erro ao carregar servidores:', error)
      return []
    }
  }

  static async atualizarServidor(id: string, dados: Partial<SupabaseServidor>): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('servidores')
        .update(dados)
        .eq('id', id)

      if (error) {
        console.error('❌ Erro ao atualizar servidor no Supabase:', error)
        return false
      }

      console.log('✅ Servidor atualizado no Supabase:', id)
      return true
    } catch (error) {
      console.error('❌ Erro ao atualizar servidor:', error)
      return false
    }
  }

  static async excluirServidor(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('servidores')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Erro ao excluir servidor do Supabase:', error)
        return false
      }

      console.log('✅ Servidor excluído do Supabase:', id)
      return true
    } catch (error) {
      console.error('❌ Erro ao excluir servidor:', error)
      return false
    }
  }

  // Banners
  static async salvarBanner(banner: SupabaseBanner): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('banners')
        .upsert({
          id: banner.id,
          categoria: banner.categoria,
          imagem_url: banner.imagem_url,
          logo_url: banner.logo_url,
          sinopse: banner.sinopse,
          data_evento: banner.data_evento,
          logo_personalizada: banner.logo_personalizada,
          posicao_logo: banner.posicao_logo,
          data_criacao: banner.data_criacao,
          usuario_id: banner.usuario_id
        })

      if (error) {
        console.error('❌ Erro ao salvar banner no Supabase:', error)
        return false
      }

      console.log('✅ Banner salvo no Supabase:', banner.categoria)
      return true
    } catch (error) {
      console.error('❌ Erro ao salvar banner:', error)
      return false
    }
  }

  static async carregarBanners(): Promise<SupabaseBanner[]> {
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('❌ Erro ao carregar banners do Supabase:', error)
        return []
      }

      return data || []
    } catch (error) {
      console.error('❌ Erro ao carregar banners:', error)
      return []
    }
  }

  static async excluirBanner(id: string): Promise<boolean> {
    try {
      const { error } = await supabase
        .from('banners')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('❌ Erro ao excluir banner do Supabase:', error)
        return false
      }

      console.log('✅ Banner excluído do Supabase:', id)
      return true
    } catch (error) {
      console.error('❌ Erro ao excluir banner:', error)
      return false
    }
  }

  // Autenticação
  static async autenticar(email: string, senha: string): Promise<SupabaseUsuario | null> {
    try {
      const { data, error } = await supabase
        .from('usuarios')
        .select('*')
        .eq('email', email)
        .eq('senha', senha)
        .eq('ativo', true)
        .single()

      if (error || !data) {
        console.log('❌ Credenciais inválidas ou usuário inativo:', email)
        return null
      }

      // Atualizar último acesso
      await this.atualizarUsuario(data.id, { ultimo_acesso: new Date().toISOString() })

      console.log('✅ Login realizado com sucesso no Supabase:', data.nome)
      return data
    } catch (error) {
      console.error('❌ Erro na autenticação:', error)
      return null
    }
  }

  // Sincronização completa
  static async sincronizarTodos(): Promise<{
    usuarios: SupabaseUsuario[]
    clientes: SupabaseCliente[]
    servidores: SupabaseServidor[]
    banners: SupabaseBanner[]
  }> {
    try {
      const [usuarios, clientes, servidores, banners] = await Promise.all([
        this.carregarUsuarios(),
        this.carregarClientes(),
        this.carregarServidores(),
        this.carregarBanners()
      ])

      console.log('✅ Sincronização completa do Supabase:', {
        usuarios: usuarios.length,
        clientes: clientes.length,
        servidores: servidores.length,
        banners: banners.length
      })

      return { usuarios, clientes, servidores, banners }
    } catch (error) {
      console.error('❌ Erro na sincronização:', error)
      return { usuarios: [], clientes: [], servidores: [], banners: [] }
    }
  }
}