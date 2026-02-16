# SelfOS Architecture

SelfOS is designed with a focus on privacy, simplicity, and modularity. This document outlines the technical architecture of the system.

## 🏛️ Overall Design

SelfOS follows a **Local-First** approach. All user data is stored within the browser's storage (LocalStorage) and logic is executed entirely on the client-side.

### High-Level Layers

1. **UI Layer (Svelte Components)**: Modular components built with Svelte 5.
   - **Device Layouts**: The system detects screen size at the root and dynamically renders either `MobileLayout` or `DesktopLayout`.
   - **Shared Components**: Core logic components are shared, while visual presentation is optimized for each platform (e.g., `MobileNav` vs `Sidebar`).
2. **State Layer (Custom Stores)**: Svelte 5 Runes-based stores that manage reactive state.
3. **Persistence Layer (LocalStore Wrapper)**: A thin abstraction over LocalStorage that handles JSON serialization and initial defaults.
4. **Utilities Layer**: Pure functions for date manipulation, formatting, and data parsing.

## 🔄 State Management (Svelte 5 Runes)

SelfOS leverages Svelte 5's new reactivity system (Runes) to manage state efficiently.

- **`$state`**: Used for mutable data within classes/stores.
- **`$derived`**: Used for data that depends on other state (e.g., filtered tasks, total balance).
- **`$props`**: Used for component inputs.

Example of a Store pattern:

```typescript
class FeatureStore {
    data = $state([]);
    filtered = $derived(this.data.filter(...));
    
    add(item) { this.data.push(item); }
}
```

## 📂 PARA System

The application uses the PARA (Projects, Areas, Resources, Archives) system for organization, as popularized by Tiago Forte.

- **Projects**: Active goals with a deadline.
- **Areas**: Ongoing responsibilities (e.g., Finance, Health, Goals).
- **Resources**: Topics of interest.
- **Archives**: Completed or abandoned items.

## 🔒 Security and Privacy

- **No Backend**: No user data is sent to a server.
- **Client-Side Processing**: All parsing (e.g., YouTube playlist expansion) happens in the browser or via ephemeral serverless functions if needed.

---

*Stay Mindful. Stay Organized.*
