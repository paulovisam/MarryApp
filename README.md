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
  - História do Casal (timeline interativa)
  - Galeria de Lembranças
  - Footer com informações do evento

## 🚀 Tecnologias

- **React 18**: Biblioteca JavaScript para construção de interfaces
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
├── src/
│   ├── components/
│   │   ├── About.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Memories.jsx
│   │   ├── Monogram.jsx
│   │   └── Story.jsx
│   ├── App.jsx
│   ├── index.css
│   └── main.jsx
├── index.html
├── package.json
├── tailwind.config.js
├── vite.config.js
└── README.md
```

## 🖼️ Adicionando Imagens

Para adicionar fotos reais do casal:

1. Coloque as imagens na pasta `public/`
2. Atualize os componentes substituindo os placeholders:
   - Hero: foto principal do casal
   - About: fotos individuais dos noivos
   - Memories: galeria de momentos especiais

## 📝 Licença

Este projeto foi criado para uso pessoal em eventos de casamento.

---

Feito com ❤️ para celebrar o amor de Sara & Paulo

