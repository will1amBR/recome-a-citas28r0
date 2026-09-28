# Design System — Recomeça

> **Versão:** 1.0.0 (Fase 1 — Fundação Visual)  
> **Linguagem:** Português do Brasil  
> **Estilo geral:** Calmo, acolhedor, arredondado, amigável, mobile-first.

---

## 1. Visão Geral e Princípios Fundamentais

O **Recomeça** é um aplicativo de apoio acolhedor para pessoas que desejam controlar, reduzir ou parar vícios (substâncias, açúcar/cafeína e remédios). O aplicativo atua como um companheiro de caminhada: nunca como um ambiente clínico e frio, e jamais como uma gamificação espalhafatosa com sinos e punições.

### Princípios de Design

1. **Calma:** Tons suaves de verde-água e off-white quente. Espaçamentos generosos e respiração visual.
2. **Acolhimento:** Cantos arredondados, contrastes suaves, microinterações lentas e gentis.
3. **Ausência de Julgamento:** Sem culpa, sem vergonha, sem contadores zerados de forma agressiva. Recomeçar faz parte do processo.
4. **Mobile-First:** Pensado primariamente para uma mão no smartphone em momentos de vulnerabilidade ou rotina.
5. **Coral Exclusivo para o SOS:** O tom coral (`#E86A4C` / `#F07856`) é estritamente reservado para o botão de apoio imediato / SOS. Nenhum outro elemento do sistema tem autorização para utilizá-lo.
6. **Sem Imagens de Substâncias:** Ícones e ilustrações nunca retratam garrafas, cigarros, seringas, comprimidos explícitos ou qualquer representação pejorativa ou glamourizante.

---

## 2. Paleta de Cores e Tokens Semânticos

### 2.1 Modo Claro (Padrão)

| Papel Semântico           | Variável CSS             | Hex       | Descrição / Uso                                                         |
| :------------------------ | :----------------------- | :-------- | :---------------------------------------------------------------------- |
| **Primária**              | `--color-primary`        | `#7FBFA8` | Verde-água suave: botões primários, links, destaques serenos.           |
| **Primária Hover**        | `--color-primary-hover`  | `#6DA98F` | Estado de hover/toque do verde-água.                                    |
| **Fundo Principal**       | `--color-background`     | `#FDFAF5` | Off-white quente e acolhedor para a base de todas as telas.             |
| **Superfície Elevada**    | `--color-surface`        | `#F4F7F2` | Fundo de cartões, formulários e blocos de conteúdo.                     |
| **Destaque Suave**        | `--color-highlight`      | `#E8F3EC` | Chips, badges, seleção ativa suave.                                     |
| **Texto Principal**       | `--color-text-primary`   | `#2F4A3E` | Verde-musgo escuro: títulos e corpo, alto contraste sem ser preto puro. |
| **Texto Secundário**      | `--color-text-secondary` | `#6A7A72` | Cinza-esverdeado: legendas, metadados, apoios.                          |
| **Borda Padrão**          | `--color-border`         | `#E1E8E2` | Linhas sutis e divisores gentis.                                        |
| **SOS Coral (EXCLUSIVO)** | `--color-sos`            | `#E86A4C` | **USO ÚNICO:** Botão de emergência / SOS.                               |
| **SOS Hover**             | `--color-sos-hover`      | `#D95C3F` | Hover do botão de emergência.                                           |

### 2.2 Cores de Feedback e Estado

| Papel                    | Variável CSS                  | Hex       | Exemplo de Aplicação                                |
| :----------------------- | :---------------------------- | :-------- | :-------------------------------------------------- |
| **Sucesso**              | `--color-feedback-success`    | `#4CAF7D` | Confirmação de registro diário, check-in concluído. |
| **Atenção**              | `--color-feedback-warning`    | `#E8A84C` | Avisos preventivos não punitivos.                   |
| **Erro**                 | `--color-feedback-error`      | `#D96C68` | Borda de campo com erro gentil.                     |
| **Info**                 | `--color-feedback-info`       | `#6CA8D6` | Dicas e notas informativas.                         |
| **Desabilitado (Fundo)** | `--color-state-disabled-bg`   | `#C4CFC8` | Botão ou campo inativo.                             |
| **Desabilitado (Texto)** | `--color-state-disabled-text` | `#8FA096` | Texto legível de controle desabilitado.             |
| **Foco Visível**         | `--color-state-focus`         | `#6DA98F` | Outline 2-3px com 2px de offset (nunca removido).   |

### 2.3 Modo Escuro (Dark Mode — `prefers-color-scheme` e classe `.dark`)

| Papel Semântico        | Hex Dark  | Observação                                                    |
| :--------------------- | :-------- | :------------------------------------------------------------ |
| **Fundo Principal**    | `#1C2420` | Verde-escuro profundo acolhedor (não é preto puro `#000000`). |
| **Superfície Elevada** | `#242E29` | Cartões e painéis com elevação sutil.                         |
| **Texto Principal**    | `#E8EFE9` | Branco suave com leve calor esverdeado (WCAG AA).             |
| **Texto Secundário**   | `#A0B0A7` | Cinza-claro esverdeado para suporte.                          |
| **Primária**           | `#8FCCAE` | Verde-água com maior luminosidade para leitura no escuro.     |
| **Primária Hover**     | `#A3D9C0` | Hover com toque luminoso suave.                               |
| **SOS Coral**          | `#F07856` | Coral mais aberto para contraste e visibilidade imediata.     |
| **SOS Hover**          | `#FF8A6A` | Hover do botão de emergência no escuro.                       |

---

## 3. Tipografia

A tipografia oficial é a **Nunito** (do Google Fonts), escolhida por seus traços arredondados, alta legibilidade em telas móveis e tom de voz acolhedor.

- **Pesos utilizados:** 400 (Regular), 600 (Semibold) e 700 (Bold).
- **Regra obrigatória:** Nunca utilizar pesos finos (< 400), que prejudicam a leitura em luz baixa ou sob ansiedade.
- **Números de contagem:** Sempre com `tabular-nums` para que dígitos não desloquem visualmente os números em animações ou relógios.

### Escala Tipográfica

| Nível              | Tamanho Mobile | Tamanho Tablet/Desktop | Peso | Line Height | Uso                                       |
| :----------------- | :------------- | :--------------------- | :--- | :---------- | :---------------------------------------- |
| **Contador Hero**  | 44px–48px      | 56px–64px              | 700  | 1.0–1.1     | Dias limpos / tempo na tela Hoje.         |
| **Display**        | 28px–32px      | 36px–40px              | 700  | 1.2         | Boas-vindas e saudações principais.       |
| **Título (h2)**    | 22px–24px      | 24px                   | 700  | 1.25        | Cabeçalhos de tela e blocos chave.        |
| **Subtítulo (h3)** | 18px–19px      | 20px                   | 600  | 1.3         | Títulos de cartões e seções internas.     |
| **Corpo (Base)**   | 16px           | 16px                   | 400  | 1.5         | Texto principal, reflexões e parágrafos.  |
| **Suporte**        | 14px           | 14px                   | 400  | 1.4         | Descrições secundárias, legendas e dicas. |
| **Micro/Label**    | 12px–13px      | 12px–13px              | 600  | 1.3         | Badges, chips, tags e rótulos de campos.  |

---

## 4. Espaçamento, Grid e Layout Responsivo

### Escala de Espaçamento (Base 4px)

- `space-1` = `4px`
- `space-2` = `8px`
- `space-3` = `12px`
- `space-4` = `16px` (Padrão mobile)
- `space-5` = `20px`
- `space-6` = `24px` (Padding de tela e margens)
- `space-8` = `32px` (Separação entre blocos)
- `space-10` = `40px`
- `space-12` = `48px`
- `space-16` = `64px`

### Larguras Máximas e Margens de Tela

- **Mobile (0–639px):** Margem lateral de `16px`. Largura máxima de conteúdo `480px`.
- **Tablet (640–1023px):** Margem lateral de `24px`. Largura máxima de conteúdo `600px`.
- **Desktop (1024px+):** Margem lateral de `32px`. Largura máxima de conteúdo `720px`. O conteúdo nunca se estica em tela cheia para preservar a concentração.

---

## 5. Raios de Borda e Sombras

### Raios de Borda

- `radius-sm` (`8px`): Chips, badges e pequenos indicadores.
- `radius-md` (`12px`): Campos de entrada de texto e botões compactos.
- `radius-lg` (`16px`): Botões de ação principais e cartões padrão.
- `radius-xl` (`20px`): Cartões maiores, recipientes de hábitos e modais.
- `radius-full` (`999px`): Botões tipo pílula, avatares e contadores circulares.

### Sombras e Elevação

- **Sombra Suave (`sm`):** `0 1px 2px rgba(47, 74, 62, 0.06)`
- **Sombra Cartão (`md`):** `0 2px 8px rgba(47, 74, 62, 0.08)`
- **Sombra Modal (`lg`):** `0 4px 16px rgba(47, 74, 62, 0.12)`
- **Sombra SOS (`xl` / SOS):** `0 8px 24px rgba(232, 106, 76, 0.3)`
  - _Regra de Elevação:_ O botão SOS tem sombra e z-index permanentemente superiores aos outros elementos da interface, garantindo que seja facilmente localizado em situações de crise ou fissura.

---

## 6. Estados, Transições e Acessibilidade

### Estados Interativos

- **Repouso:** Cores padrão dos tokens.
- **Hover (Desktop):** Duração de `150ms`, escurecimento sutil sem agressividade.
- **Ativo / Pressionado:** `transform: scale(0.98)` com transição suave de `100ms`.
- **Foco do Teclado:** `outline: 2px solid #6DA98F; outline-offset: 2px;` — acessibilidade preservada sempre.
- **Erro em Formulários:** Borda de `2px solid #D96C68` acompanhada de mensagem gentil.
- **Alvo de Toque Mínimo:** Todos os elementos interativos possuem área clicável mínima de `44x44px` (recomendado `48x48px` em mobile).

### Animações e Movimento Reduzido

- **Transição Padrão:** `cubic-bezier(0.4, 0, 0.2, 1)`.
- **Entrada / Saída:** `250ms–300ms` com fade e deslocamento vertical sutil (`12px`).
- **Timer de Respiração Guiada (Futuro):** Ciclo suave de 8 segundos (4s inspiração, 4s expiração).
- **`prefers-reduced-motion`:** Quando ativo no sistema do usuário, todas as animações decorativas e transições são desativadas ou reduzidas a `0.01ms`.

---

## 7. Tom de Voz e Diretrizes de Conteúdo

### Regras de Escrita

1. **Frases curtas:** Máximo de 15 a 20 palavras por sentença. Simples, diretas e gentis.
2. **Sem Culpa e Sem Vergonha:**
   - ❌ _Evitar:_ "Você falhou", "Sequência perdida", "Por que você bebeu?", "Recaída no dia 4".
   - ✅ _Preferir:_ "Recomeçar faz parte do caminho", "Um dia de cada vez", "O que você aprendeu com hoje?", "Sua melhor sequência foi de 14 dias — esse progresso é seu."
3. **Sem Prescrição Médica ou Sugestão de Doses:**
   - Nunca sugerir doses ou desmame por conta própria.
   - Sempre orientar: _"Converse com seu médico antes de fazer alterações."_
4. **Notificações Discretas e Neutras:**
   - As notificações nunca exibem nomes de vícios ("álcool", "cigarro", "cocaína").
   - Mensagens discretas: _"Seu lembrete do dia está pronto"_, _"Como você está se sentindo hoje?"_.

### Avisos Legais Obrigatórios

Estes textos devem constar nos locais apropriados do aplicativo:

> **Geral:**  
> _"Este app não substitui tratamento. Em emergência, ligue 192."_

> **Substâncias com risco de abstinência grave (álcool, calmantes, opioides):**  
> _"Parar de uma vez pode ser perigoso. Converse com um médico antes."_

---

## 8. Sistema de Ícones

- Utiliza-se a biblioteca `lucide-react`.
- Ícones com traço arredondado (`strokeWidth: 2px`), cantos suaves.
- Tamanhos recomendados:
  - `16px`: Chips, badges, indicadores menores.
  - `20px`: Acompanhamento de inputs e botões compactos.
  - `24px`: Barra de navegação e botões principais.
- **Proibição estrita:** É proibido o uso de ícones ou ilustrações que representem substâncias químicas, bebidas alcoólicas, cigarros, cinzeiros ou comprimidos explícitos.
