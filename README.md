# <img src="./static/favicon.png" width="32" height="32" valign="middle"> SelfOS

### **A Mindful Personal Operating System for High-Focus Rituals**

SelfOS is a minimalist, intentional, and feature-rich personal dashboard designed to help you manage your digital life with clarity and focus. It transforms your browser into a unified workstation for tracking tasks, habits, finances, and growth.

> [!IMPORTANT]
> **Local-First Architecture:** Your data belongs to you. SelfOS prioritizes local privacy while offering seamless Supabase cloud synchronization for multi-device harmony.

---

## 🌟 Vision & Values

SelfOS isn't just a productivity app; it's a philosophy of intentional living.

* **Intentionality**: Focus on what matters, not just what's next.
* **Aesthetics**: High-end glassmorphism and motion-rich design for a calm digital environment.
* **Efficiency**: Navigate your entire OS via global keyboard shortcuts.
* **Modularity**: Choose the modules that fit your life using the built-in Feature Flags.
* **📱 Mobile-First**: A premium, app-like experience with floating navigation, haptic-ready transitions, and slide-up system menus.

---

## 🚀 Key Modules

SelfOS utilizes a custom implementation of the **PARA System** (Projects, Areas, Resources, Archives) to organize your knowledge.

| Module | Description | Highlights |
| :--- | :--- | :--- |
| **🎯 Dashboard** | Your daily command center. | Asymmetrical "Hero" view, Quick Start widgets. |
| **✅ Tasks** | Beyond a simple To-Do list. | Scratchpad support, PARA-linked projects. |
| **🔥 Habits** | Ritual consistency tracker. | GitHub-style heatmap, "Champion" streak status. |
| **📉 Goals** | Strategic 'War Room'. | Hierarchical roadmaps, YT Playlist Importer. |
| **🧘 Focus** | Zen workstation. | Pomodoro timers, immersive ambient modes. |
| **💰 Finance** | Wealth management. | Expense tracking and monthly budget vitals. |
| **🏋️ Vitals** | Fitness & Nutrition. | Macro tracking, workout logs, health metrics. |
| **📝 Knowledge** | Notes & Journaling. | Obsidian-style intentional note-taking. |

---

## ⌨️ Global Command Center

SelfOS is built for power users. Master these shortcuts to fly through your day:

| Shortcut | Action |
| :--- | :--- |
| <kbd>Space</kbd> | Global Search / Command Palette |
| <kbd>s</kbd> | System Settings |
| <kbd>Tab</kbd> | Toggle Chrome (Sidebar/Header) |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>/</kbd> | Open Tutorial Hub |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>.</kbd> | Next Tutorial Step |
| <kbd>Ctrl</kbd> + <kbd>Shift</kbd> + <kbd>,</kbd> | Previous Tutorial Step |

---

## 🛠️ The Core Stack

SelfOS leverages modern web primitives to ensure performance and reliability.

* **Framework**: [SvelteKit](https://kit.svelte.dev/) (Powered by Svelte 5 Runes)
* **Language**: TypeScript for end-to-end type safety
* **Styling**: Vanilla CSS with Tailwind CSS for utility spacing
* **Icons**: [Lucide Svelte](https://lucide.dev/guide/svelte)
* **Backend**: [Supabase](https://supabase.com/) (Auth, Database, Storage)
* **Animation**: Svelte Native Transitions & Framer-like micro-interactions

---

## 🛠️ Installation & Setup

### Prerequisites

* Node.js (v18+)

* npm / pnpm / yarn

### Launching SelfOS

1. **Clone & Enter**

   ```bash
   git clone https://github.com/AnshumSrivastava/SelfOS.git
   cd SelfOS
   ```

2. **Install Rituals**

   ```bash
   npm install
   ```

3. **Initialize Environment**
   Create a `.env` file with your Supabase credentials:

   ```env
   PUBLIC_SUPABASE_URL=your_project_url
   PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

4. **Boot Up**

   ```bash
   npm run dev
   ```

---

## 📂 Architecture Overview

```text
src/
├── lib/
│   ├── components/   # Atomic UI components & Feature modules
│   │   ├── mobile/   # Specialized Mobile UI (Header, Nav, Menu)
│   ├── stores/       # Svelte 5 Stores (LocalStore + Supabase sync)
│   ├── tutorial/     # Interactive onboarding engine
│   └── utils/        # Date formatting, math, and helpers
├── routes/           # File-based routing (SvelteKit)
└── app.css           # Core Design System & Tokens
```

---

## 🤝 Contributing & Community

We believe in open growth. Check out our [CONTRIBUTING.md](./CONTRIBUTING.md) to see how you can help build the future of SelfOS.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

*Built with ❤️ for a more mindful life.*
