<script>
    import { onMount } from "svelte";
    import { page } from "$app/stores";
    import { base } from "$app/paths";

    let scrolled = false;
    let isQuickCaptureOpen = false;

    onMount(() => {
        const handleScroll = () => {
            scrolled = window.scrollY > 20;
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    });

    const links = [
        { name: "Hub", icon: "◈", href: `${base}/` },
        { name: "Habits", icon: "↺", href: `${base}/habits` },
        { name: "Finance", icon: "₹", href: `${base}/finance` },
        { name: "Fitness", icon: "♥", href: `${base}/fitness` },
        { name: "Nutrition", icon: "🥗", href: `${base}/nutrition` },
        { name: "Tasks", icon: "✓", href: `${base}/tasks` },
        { name: "Notes", icon: "✎", href: `${base}/notes` },
        { name: "Library", icon: "📚", href: `${base}/library` },
        { name: "Goals", icon: "🎯", href: `${base}/goals` },
        { name: "Projects", icon: "◰", href: `${base}/para` },
        { name: "Journal", icon: "📖", href: `${base}/journal` },
        { name: "Focus", icon: "⏱", href: `${base}/focus` },
    ];
</script>

<nav class="navbar {scrolled ? 'scrolled' : ''}">
    <div class="nav-inner glass">
        <div class="logo">
            <span class="logo-symbol">S</span>
            <span class="logo-text">SelfOS</span>
        </div>

        <div class="nav-links">
            {#each links as link}
                {@const isActive = $page.url.pathname === link.href}
                <a href={link.href} class="nav-link {isActive ? 'active' : ''}">
                    <span class="link-icon">{link.icon}</span>
                    <span class="link-name">{link.name}</span>
                </a>
            {/each}
        </div>

        <div class="nav-actions">
            <button
                class="quick-capture-btn"
                title="Quick Capture"
                on:click={() => (isQuickCaptureOpen = true)}
            >
                <span>+</span>
            </button>
        </div>
    </div>
</nav>

<style>
    .navbar {
        position: fixed;
        top: 20px;
        left: 0;
        right: 0;
        z-index: 1000;
        display: flex;
        justify-content: center;
        padding: 0 24px;
        transition: var(--transition-smooth);
    }

    .nav-inner {
        display: flex;
        align-items: center;
        justify-content: space-between;
        width: 100%;
        max-width: 1200px;
        height: 64px;
        padding: 0 24px;
        border-radius: 32px;
    }

    .logo {
        display: flex;
        align-items: center;
        gap: 8px;
        font-family: var(--font-heading);
        font-weight: 700;
        font-size: 1.25rem;
    }

    .logo-symbol {
        color: var(--color-primary);
    }

    .nav-links {
        display: flex;
        gap: 8px;
    }

    .nav-link {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 8px 16px;
        border-radius: 20px;
        text-decoration: none;
        color: var(--text-secondary);
        font-size: 0.9rem;
        font-weight: 500;
        transition: var(--transition-smooth);
    }

    .nav-link:hover {
        color: var(--text-primary);
        background: rgba(255, 255, 255, 0.05);
    }

    .link-icon {
        font-size: 1.1rem;
        opacity: 0.7;
    }

    .quick-capture-btn {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        border: none;
        background: var(--color-primary);
        color: black;
        font-size: 1.5rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: var(--transition-smooth);
        box-shadow: 0 4px 12px rgba(94, 234, 212, 0.3);
    }

    .quick-capture-btn:hover {
        transform: scale(1.1);
        box-shadow: 0 6px 16px rgba(94, 234, 212, 0.4);
    }

    @media (max-width: 768px) {
        .navbar {
            top: auto;
            bottom: 20px;
            padding: 0 16px;
            overflow: hidden; /* Prevent localized overflow issues */
        }

        .nav-inner {
            justify-content: flex-start; /* Start from left */
            padding: 0 8px;
            overflow-x: auto; /* Enable horizontal scrolling */
            -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */
            gap: 12px;
            width: 100%;
            max-width: 100%;
            scrollbar-width: none; /* Hide scrollbar Firefox */
        }

        .nav-inner::-webkit-scrollbar {
            display: none; /* Hide scrollbar Chrome/Safari */
        }

        .nav-links {
            display: contents; /* Let children sit directly in the scroll container or just keep them as flex items */
        }

        /* Actually simpler: keep nav-links as the flex container if it isn't already */
        /* But structure is .nav-inner > .nav-links */
        /* Let's make .nav-inner the scroll window */

        .nav-links {
            display: flex;
            gap: 12px;
            padding: 0 12px;
            width: max-content; /* Allow growing beyond parent */
        }

        .link-name {
            display: none;
        }

        .nav-link {
            flex-shrink: 0; /* Prevent squashing */
            width: 48px;
            height: 48px;
            justify-content: center;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.03);
            padding: 0;
        }

        .nav-link.active {
            background: var(--color-primary);
            color: black;
        }

        .logo {
            display: none;
        }

        .nav-actions {
            /* Sticky action button or integrated? */
            /* Let's keep it but maybe it should be fixed or just part of the flow */
            display: none; /* Hiding quick capture for now to simplify scroll area, user can use hub */
        }
    }
</style>
