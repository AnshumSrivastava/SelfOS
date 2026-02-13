# SelfOS - Your Mindful Personal Operating System

SelfOS is a minimalist, intentional, and feature-rich personal dashboard designed to help you manage your life with clarity and focus. Built with SvelteKit and Tailwind CSS, it provides a seamless experience for tracking tasks, habits, finances, and focus sessions.

## 🌟 Vision

SelfOS aims to be a single source of truth for your digital life, prioritizing:

- **Intentionality**: Focus on what matters, not just what's next.
- **Privacy**: Your data stays local (Local-First architecture).
- **Aesthetics**: A calm, premium interface that doesn't overwhelm.
- **Modularity**: Individual modules for different aspects of life (PARA system).

---

## 📸 Screenshots

| Dashboard | Tasks | Habits |
|-----------|-------|--------|
| ![Dashboard](./screenshots/dashboard.png) | ![Tasks](./screenshots/tasks.png) | ![Habits](./screenshots/habits.png) |

| Focus | Finance | Nutrition |
|-------|---------|-----------|
| ![Focus](./screenshots/focus.png) | ![Finish](./screenshots/finance.png) | ![Nutrition](./screenshots/nutrition.png) |

---

## ✨ Key Features

| Feature | Description | Status |
|---------|-------------|--------|
| **🎯 Dashboard** | Central overview of your day and priority tasks. | ✅ Done |
| **✅ Tasks** | PARA-based task management with scratchpad support. | ✅ Done |
| **📅 Habits** | Visual habit tracker with streak mechanics. | ✅ Done |
| **🎯 Goals** | A robust goal tracking system with board views. | ✅ Done |
| **🧘 Focus** | Zen mode with pomodoro-style timers. | ✅ Done |
| **💰 Finance** | Expense tracking, budgeting, and financial goals. | ✅ Done |
| **🍎 Nutrition** | Macronutrient calculation and meal tracking. | ✅ Done |
| **🏋️ Fitness** | Workout logging and health statistics tracking. | ✅ Done |
| **📓 Journal** | Daily reflection and thought tracking. | ✅ Done |
| **📚 Library** | Book tracking and reading progress. | ✅ Done |
| **📝 Notes** | Intentional note-taking and knowledge management. | ✅ Done |
| **📁 PARA** | Projects, Areas, Resources, Archives organization. | ✅ Done |
| **📱 Mobile** | Responsive design optimized for all devices. | ✅ Done |

---

## 🛠️ Tech Stack

- **Framework**: [SvelteKit](https://kit.svelte.dev/) (Svelte 5 Runes)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide Svelte](https://lucide.dev/guide/svelte)
- **State Management**: Svelte 5 `$state` and `$derived` via custom stores
- **Storage**: Browser LocalStorage (Local-First logic)

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm (or pnpm / yarn)

### Installation

1. **Clone the repository**:

   ```sh
   git clone https://github.com/AnshumSrivastava/SelfOS.git
   cd SelfOS
   ```

2. **Install dependencies**:

   ```sh
   npm install
   ```

3. **Start the development server**:

   ```sh
   npm run dev
   ```

4. **Build for production**:

   ```sh
   npm run build
   ```

---

## 📂 Project Structure

```text
SelfOS/
├── src/
│   ├── lib/              # Core application logic
│   │   ├── components/   # UI components grouped by feature
│   │   ├── stores/       # Svelte 5 state stores (LocalStore wrapper)
│   │   ├── utils/        # Shared helper functions (date, math, etc.)
│   │   └── types/        # TypeScript interfaces and types
│   ├── routes/           # SvelteKit page routes
│   └── app.html          # Main HTML entry point
├── static/               # Public assets (images, fonts)
├── screenshots/          # Documentation media
└── tailwind.config.ts    # Styling configuration
```

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines on how to get started.

---

## 📄 License

This project is licensed under the MIT License - see the `LICENSE` file for details.

---

*Built with ❤️ for a more mindful life.*
