# Knowledge Platform — Frontend

React SPA for the Knowledge Sharing Platform with AI-assisted writing features.

## Architecture Overview

```
frontend/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx           # Navigation with auth-aware links
│   │   ├── ArticleCard.jsx      # Article preview card
│   │   ├── RichTextEditor.jsx   # TipTap rich text editor with toolbar
│   │   └── AIAssistant.jsx      # AI writing assistant panel
│   ├── pages/
│   │   ├── HomePage.jsx         # Article list with search & filter
│   │   ├── ArticleDetailPage.jsx # Full article view
│   │   ├── CreateEditPage.jsx   # Create/edit with AI assist
│   │   ├── DashboardPage.jsx    # User's article management
│   │   ├── LoginPage.jsx        # Email + password login
│   │   └── SignupPage.jsx       # User registration
│   ├── context/
│   │   └── AuthContext.jsx      # Global auth state (JWT + user)
│   ├── services/
│   │   └── api.js               # Axios client with JWT interceptor
│   ├── App.jsx                  # Router + providers
│   ├── main.jsx                 # Entry point
│   └── index.css                # Complete design system
├── index.html
├── vite.config.js
└── package.json
```

### Key Design Decisions

- **Vite** for fast dev server with API proxy to backend
- **TipTap Editor** — rich text editing with full formatting toolbar (bold, italic, headings, lists, code blocks, blockquotes)
- **AI Assistant Sidebar** — 5 AI actions directly in the editor (improve, grammar, concise, title suggestions, tag suggestions)
- **Dark Theme** — premium glassmorphism design with gradient accents
- **AuthContext** — centralized JWT management with auto-verification on mount
- **Axios interceptor** — auto-attaches JWT token, redirects on 401

## Features

- 🏠 **Home Page** — article grid with search (title/content/tags) and category filter
- 📝 **Rich Editor** — TipTap with formatting toolbar, AI-powered writing assistance
- 🤖 **AI Assist** — Improve writing, fix grammar, make concise, suggest titles, suggest tags
- 📊 **Dashboard** — manage your articles (view/edit/delete)
- 🔐 **Auth** — JWT-based signup/login/logout
- 📱 **Responsive** — mobile-friendly layout

## AI Usage

**AI Tool Used:** Claude AI (Cursor IDE) + Google Gemini (in-app features)

### Where AI Helped:
- **UI design**: Component structure, dark theme color palette, glassmorphism effects
- **Code generation**: React component boilerplate, TipTap editor setup, Axios interceptors
- **Refactoring**: AuthContext pattern, API service layer abstraction
- **CSS**: Design system with CSS variables, responsive breakpoints, animation keyframes
- **UX ideas**: AI assistant sidebar layout, title suggestion flow, tag suggestion integration

### What Was Reviewed/Corrected Manually:
- TipTap editor content sync (external updates from AI)
- Auth flow edge cases (redirect logic, token persistence)
- Responsive layout adjustments for mobile
- Form validation and error handling
- CSS specificity and visual polish

## Setup Instructions

### Prerequisites
- Node.js v18+
- Backend server running on port 5000

### Install & Run
```bash
cd frontend
npm install
npm run dev
```

The dev server starts on `http://localhost:3000` with API proxy to `http://localhost:5000`.

### Build for Production
```bash
npm run build     # Output in dist/
npm run preview   # Preview production build
```
