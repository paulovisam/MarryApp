# MarryApp - Landing Page de Casamento

Uma landing page moderna e elegante para casamento, construída com React, Tailwind CSS e Vite.

## 🎨 Características

- **Design Minimalista e Premium**: Visual sofisticado com tema escuro em azul escuro, branco e vermelho bordô
- **Totalmente Responsivo**: Adaptado para todos os dispositivos (mobile, tablet e desktop)
- **Tipografia Elegante**: Uso de fontes premium (The Seasons, Playfair Display, Montserrat)
- **Tema Escuro Sofisticado**: Background em gradientes escuros (cinza, slate, azul escuro)
- **Animações Suaves**: Transições e efeitos que proporcionam uma experiência fluida
- **Seções Completas**:
  - Hero com monograma personalizado
  - Sobre os Noivos
  - História do Casal (timeline interativa com lightbox)
  - Galeria de Lembranças
  - Página de Convite personalizada (/convite)
  - Footer com informações do evento
- **Música de Fundo**: Player elegante com controles de volume e play/pause
- **Lightbox de Fotos**: Galeria interativa com navegação por teclado

## 🚀 Tecnologias

- **React 18**: Biblioteca JavaScript para construção de interfaces
- **React Router DOM**: Roteamento client-side para múltiplas páginas
- **Vite**: Build tool ultra-rápido
- **Tailwind CSS**: Framework CSS utility-first
- **React Icons**: Biblioteca de ícones

## 📦 Instalação

1. Instale as dependências:
```bash
npm install
```

2. Inicie o servidor de desenvolvimento:
```bash
npm run dev
```

3. Acesse no navegador:
```
http://localhost:3000
```

## 🏗️ Build para Produção

Para criar uma versão otimizada para produção:

```bash
npm run build
```

Para visualizar o build de produção localmente:

```bash
npm run preview
```

## 🌐 Deploy na Vercel

O projeto está configurado para deploy automático na Vercel:

1. Conecte seu repositório GitHub à Vercel
2. A cada push, o deploy é feito automaticamente
3. O arquivo `vercel.json` já está configurado para SPA routing

**Importante**: O `vercel.json` garante que rotas como `/convite` funcionem corretamente em produção.

## 🎨 Personalização

### Cores

As cores principais podem ser ajustadas no arquivo `tailwind.config.js`:
- **Burgundy (Bordô)**: `#800020` - Usado para destaques e acentos
- **Royal Blue (Azul Royal)**: `#4169E1` - Usado para elementos secundários
- **Backgrounds Escuros**: 
  - Gray-900: `#111827`
  - Slate-900: `#0f172a`
  - Blue-950: `#172554`

### Conteúdo

Edite os componentes em `src/components/` para personalizar:
- **Hero.jsx**: Nomes do casal, data do casamento
- **About.jsx**: Informações sobre os noivos
- **Story.jsx**: Timeline da história do casal
- **Memories.jsx**: Galeria de fotos e citações

### Monograma

O monograma em `src/components/Monogram.jsx` usa SVG e pode ser personalizado alterando as iniciais.

## 📁 Estrutura do Projeto

```
MarryApp/
├── public/
│   ├── rings.svg
│   └── background-music.mp3  (adicionar sua música aqui)
├── src/
│   ├── assets/
│   │   ├── couple.jpg
│   │   ├── home.jpg
│   │   ├── monograma.png
│   │   └── story/
│   │       ├── encontro_*.jpeg
│   │       ├── pedido_*.jpeg
│   │       └── noivado_*.jpeg
│   ├── components/
│   │   ├── About.jsx
│   │   ├── BackgroundMusic.jsx
│   │   ├── Convite.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Memories.jsx
│   │   └── Story.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
├── vercel.json
├── MUSICA_INSTRUCOES.md
└── README.md
```

## 🖼️ Adicionando Imagens

⚠️ **Importante**: As imagens devem ser **importadas como módulos** no React para serem incluídas no bundle de produção.

**Correto:**
```jsx
import minhaFoto from '../assets/foto.jpg';
<img src={minhaFoto} alt="Descrição" />
```

**Incorreto (não funciona em produção):**
```jsx
<img src="/src/assets/foto.jpg" alt="Descrição" />
```

### Estrutura:
1. Coloque as imagens em `src/assets/`
2. Importe-as nos componentes
3. Use a variável importada no atributo `src`

## 🎵 Adicionando Música de Fundo

O site possui um player de música elegante! Para adicionar sua música:

1. Baixe uma música **sem direitos autorais** (veja `MUSICA_INSTRUCOES.md`)
2. Renomeie para `background-music.mp3`
3. Coloque em `public/background-music.mp3`
4. O player aparecerá automaticamente no canto inferior direito

**Sites recomendados para música grátis:**
- YouTube Audio Library
- Pixabay Music
- Free Music Archive

Veja instruções detalhadas em: `MUSICA_INSTRUCOES.md`

## 🔗 Rotas

- **/** - Página principal com todas as seções
- **/convite** - Página de convite personalizada

## 📝 Licença

Este projeto foi criado para uso pessoal em eventos de casamento.

---

Feito com ❤️ para celebrar o amor de Sara & Paulo

