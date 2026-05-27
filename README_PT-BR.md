# Gym Tracker - Sistema de Evolução de Carga

Um MVP leve e intuitivo para registrar treinos, acompanhar evolução de carga/repetições e visualizar progresso em gráficos interativos.

## 🚀 Início Rápido

### Instalação

```bash
npm install
# ou
pnpm install
```

### Desenvolvimento

```bash
npm run dev
# ou
pnpm dev
```

O servidor iniciará em `http://localhost:3000`

### Build para Produção

```bash
npm run build
# ou
pnpm build
```

## 📋 Funcionalidades

### 1. **Dashboard**
- Visualização de 4 métricas principais:
  - Total de treinos registrados
  - Volume total acumulado (carga × reps × séries)
  - Maior carga registrada
  - Exercício mais treinado
- **Sugestões Inteligentes** baseadas em regras de evolução:
  - Se 2 treinos seguidos com 10+ reps → aumentar carga
  - Se queda de reps em 2 treinos seguidos → manter carga ou revisar descanso
  - Se 4 treinos sem evolução → trocar variação ou ajustar técnica
- Últimos 5 treinos registrados em tabela

### 2. **Registrar Treino**
Formulário completo para adicionar novos treinos com:
- Data do treino
- Seleção de ficha (A, B ou C)
- Exercício digitável, com sugestões por ficha
- Grupo muscular
- Carga informada (kg)
- Tipo de carga:
  - **Por lado**: supino com halter de 25 kg em cada mão registra `25`; o volume considera `50`.
  - **Total**: puxada alta no pulley com 60 kg registra `60`; o volume considera `60`.
- Repetições
- Séries
- Observações opcionais
- Cálculo automático de volume total

**Fichas disponíveis:**
- **Ficha A**: Peito, Ombros, Tríceps
- **Ficha B**: Costas, Bíceps
- **Ficha C**: Pernas, Panturrilha

### 3. **Histórico**
Tabela completa com todos os treinos registrados:
- Filtros por ficha e exercício
- Colunas: Data, Ficha, Exercício, Grupo Muscular, Carga, Reps, Séries, Volume
- Botões de ação: Editar (em desenvolvimento) e Deletar
- Resumo com estatísticas dos treinos filtrados

### 4. **Evolução**
Visualização interativa com 3 gráficos:

#### Gráfico 1: Evolução de Carga por Exercício
- Linha chart mostrando evolução da carga ao longo do tempo
- Seletor de exercício para análise individual
- Pontos interativos com valores exatos

#### Gráfico 2: Evolução de Volume por Treino
- Bar chart mostrando volume total de cada sessão
- Visualização clara da progressão semanal

#### Gráfico 3: Volume por Grupo Muscular
- Pie chart com distribuição percentual
- Legenda com valores absolutos e percentuais
- Identifica grupos musculares mais trabalhados

## 💾 Persistência de Dados

O app funciona em dois modos:

- **Local**: se você não configurar Supabase, os dados ficam no `localStorage` do navegador.
- **Supabase**: se você configurar `VITE_SUPABASE_URL` e `VITE_SUPABASE_ANON_KEY`, os treinos são salvos no banco e ficam disponíveis em qualquer dispositivo.

## ☁️ Configurando Supabase grátis

1. Crie uma conta em `https://supabase.com`.
2. Clique em **New project** e crie um projeto gratuito.
3. Abra **SQL Editor** no painel do Supabase.
4. Copie e execute o conteúdo de `supabase/schema.sql`.
5. Vá em **Project Settings > API**.
6. Copie a **Project URL** e a **anon public key**.
7. Na sua máquina, crie um arquivo `.env` baseado em `.env.example`:

```bash
cp .env.example .env
```

8. Preencha:

```bash
VITE_SUPABASE_URL=https://seu-projeto.supabase.co
VITE_SUPABASE_ANON_KEY=sua-chave-anon-publica
```

9. Rode o app:

```bash
pnpm install
pnpm dev
```

> Observação: o SQL atual libera leitura e escrita para a chave pública anônima. Para um app pessoal isso é simples e funciona rápido, mas antes de divulgar o link publicamente o ideal é adicionar login com Supabase Auth e políticas por usuário.

## 🚀 GitHub Actions + GitHub Pages

1. Inicialize Git e suba para o GitHub:

```bash
git init
git add .
git commit -m "Initial gym tracker"
git branch -M main
git remote add origin https://github.com/SEU_USUARIO/gym-tracker.git
git push -u origin main
```

2. No GitHub, abra o repositório e vá em **Settings > Secrets and variables > Actions**.
3. Crie dois secrets:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_ANON_KEY`
4. Vá em **Settings > Pages**.
5. Em **Build and deployment**, selecione **GitHub Actions**.
6. Faça um push na branch `main`.
7. O workflow em `.github/workflows/deploy.yml` vai rodar `pnpm check`, `pnpm build` e publicar o app.

Depois do deploy, o app fica em:

```text
https://SEU_USUARIO.github.io/NOME_DO_REPOSITORIO/
```

## 🏋️ Exercícios Base

### Ficha A (Peito, Ombros, Tríceps)
- Supino reto com barra
- Supino inclinado com halteres
- Crucifixo na máquina
- Cross over
- Tríceps testa
- Tríceps cross
- Tríceps francês
- Elevação lateral
- Elevação frontal

### Ficha B (Costas, Bíceps)
- Puxada frente pulley
- Remada no pulley
- Remada articulada
- Crucifixo inverso
- Rosca W
- Rosca 45 no banco
- Rosca martelo
- Rosca inversa

### Ficha C (Pernas, Panturrilha)
- Agachamento
- Leg press 45
- Cadeira extensora
- Mesa flexora
- Stiff
- Panturrilha em pé

## 🎯 Como Usar

### Primeiro Acesso
1. Acesse a aplicação em `http://localhost:3000`
2. O Dashboard carregará com dados mockados de exemplo
3. Explore as diferentes páginas para familiarizar-se com a interface

### Registrando um Treino
1. Clique em **"Registrar Treino"** na navegação lateral
2. Preencha os dados do treino:
   - Selecione a data
   - Escolha a ficha (A, B ou C)
   - Selecione o exercício
   - Informe carga, repetições e séries
   - Adicione observações se necessário
3. Clique em **"Registrar Treino"**
4. Será redirecionado para o Histórico

### Visualizando Histórico
1. Clique em **"Histórico"** na navegação lateral
2. Use os filtros para encontrar treinos específicos
3. Veja o volume total de cada treino
4. Delete treinos se necessário

### Analisando Evolução
1. Clique em **"Evolução"** na navegação lateral
2. Selecione um exercício para ver sua evolução de carga
3. Visualize os gráficos de volume e distribuição muscular
4. Use os dados para ajustar seu programa de treino

## 🔧 Stack Técnico

- **Frontend**: React 19 + Vite
- **Linguagem**: TypeScript
- **Estilo**: TailwindCSS 4
- **Gráficos**: Recharts
- **UI Components**: shadcn/ui
- **Roteamento**: Wouter
- **Persistência**: Supabase REST com fallback em localStorage
- **Notificações**: Sonner

## 📁 Estrutura do Projeto

```
client/
├── src/
│   ├── components/
│   │   ├── Layout.tsx           # Layout principal com navegação
│   │   └── ...shadcn/ui components
│   ├── contexts/
│   │   └── WorkoutContext.tsx   # Contexto global de treinos
│   ├── hooks/
│   │   └── useWorkouts.ts       # Hook para gerenciar treinos
│   ├── lib/
│   │   ├── exercises.ts         # Exercícios base
│   │   ├── calculations.ts      # Cálculos e sugestões
│   │   └── mockData.ts          # Dados iniciais
│   ├── pages/
│   │   ├── Dashboard.tsx        # Página inicial
│   │   ├── Register.tsx         # Registro de treino
│   │   ├── History.tsx          # Histórico
│   │   └── Evolution.tsx        # Evolução com gráficos
│   ├── types/
│   │   └── index.ts             # Tipos TypeScript
│   ├── App.tsx                  # Rotas e layout
│   └── main.tsx                 # Entry point
└── public/
    └── favicon.ico
```

## 🎨 Design

- **Tema**: Light (padrão)
- **Cores**: Paleta azul com acentos verdes, laranjas e roxos
- **Responsividade**: Mobile-first, otimizado para desktop
- **Navegação**: Sidebar fixa em desktop, menu mobile em telas pequenas

## 🚦 Próximos Passos Sugeridos

1. **Edição de Treinos**: Implementar funcionalidade de editar treinos existentes
2. **Exportação de Dados**: Adicionar opção para exportar histórico em CSV/PDF
3. **Metas e Objetivos**: Permitir definir metas de carga/volume para cada exercício
4. **Comparação de Períodos**: Comparar evolução entre diferentes períodos
5. **Backend e Autenticação**: Migrar para backend com banco de dados para múltiplos usuários
6. **Notificações**: Alertas quando atingir metas ou quando não treinar há muito tempo
7. **Integração com Wearables**: Sincronizar com smartwatches/fitness trackers

## 📝 Notas de Desenvolvimento

- Os dados mockados são carregados automaticamente na primeira vez
- O localStorage é sincronizado em tempo real
- As sugestões são geradas dinamicamente baseadas no histórico
- Os gráficos são responsivos e se adaptam ao tamanho da tela

## 📄 Licença

MIT

## 👨‍💻 Desenvolvido por

Desenvolvido como MVP fullstack sênior com foco em simplicidade e funcionalidade.
