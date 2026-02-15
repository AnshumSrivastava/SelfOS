import { tasksStore } from './tasks.svelte';
import { habitsStore } from './habits.svelte';
import { financeStore } from './finance.svelte';
import { projectsStore } from './projects.svelte';
import { libraryStore } from './library.svelte';
import { calendarStore } from './calendar.svelte';
import { nutritionStore } from './nutrition.svelte';
import { fitnessStore } from './fitness.svelte';
import { notesStore } from './notes.svelte';
import { goalsStore } from './goals.svelte';
import { journalStore } from './journal.svelte';
import { base } from '$app/paths';

export type SearchResult = {
    id: string;
    type: 'Task' | 'Habit' | 'Finance' | 'Project' | 'Book' | 'Focus' | 'Calendar' | 'Navigation' | 'Nutrition' | 'Fitness' | 'Note' | 'Goal' | 'Journal' | 'Tutorial';
    title: string;
    subtitle?: string;
    href: string;
    date?: string; // ISO date or "Today"
};

class SearchStore {
    query = $state("");
    isOpen = $state(false);

    get results(): SearchResult[] {
        if (!this.query.trim()) return [];
        const q = this.query.toLowerCase();

        const results: SearchResult[] = [];

        // Navigation (Modules)
        const modules = [
            { name: "Dashboard", href: `${base}/` },
            { name: "Tasks", href: `${base}/tasks` },
            { name: "Habits", href: `${base}/habits` },
            { name: "Finance", href: `${base}/finance` },
            { name: "Fitness", href: `${base}/fitness` },
            { name: "Nutrition", href: `${base}/nutrition` },
            { name: "Calendar", href: `${base}/calendar` },
            { name: "Library", href: `${base}/library` },
            { name: "Projects", href: `${base}/para` },
            { name: "Focus", href: `${base}/focus` },
            { name: "Journal", href: `${base}/journal` },
            { name: "Settings", href: `${base}/settings` },
            { name: "Notes", href: `${base}/notes` },
            { name: "Goals", href: `${base}/goals` },
        ];

        modules.forEach(mod => {
            if (mod.name.toLowerCase().includes(q)) {
                results.push({
                    id: `nav-${mod.name}`,
                    type: 'Navigation',
                    title: mod.name,
                    subtitle: 'Go to module',
                    href: mod.href
                });
            }
        });

        // Tutorial Commands
        const tutorials = [
            { name: "Start Guided Tutorial", id: "tutorial-start" },
            { name: "Open Tutorial Hub", id: "tutorial-hub" },
            { name: "Restart Setup Flow", id: "tutorial-setup" },
        ];

        tutorials.forEach(t => {
            if (t.name.toLowerCase().includes(q)) {
                results.push({
                    id: t.id,
                    type: 'Tutorial',
                    title: t.name,
                    subtitle: 'Tutorial Command',
                    href: '#' // Handled by SearchModal
                });
            }
        });

        // Tasks
        tasksStore.tasks.forEach(task => {
            if (task.title.toLowerCase().includes(q) || (task.projectId && task.projectId.toLowerCase().includes(q))) {
                results.push({
                    id: task.id,
                    type: 'Task',
                    title: task.title,
                    subtitle: `Project: ${task.projectId} • Due: ${task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No Date'}`,
                    href: `${base}/tasks`,
                    date: task.createdAt
                });
            }
        });

        // Calendar / Meetings
        calendarStore.events.forEach(event => {
            if (event.title.toLowerCase().includes(q) || (event.description && event.description.toLowerCase().includes(q)) || event.type.toLowerCase().includes(q) || (event.location && event.location.toLowerCase().includes(q))) {
                results.push({
                    id: event.id,
                    type: 'Calendar',
                    title: event.title,
                    subtitle: `${event.type} • ${event.location || 'No location'}`,
                    href: `${base}/calendar`,
                    date: event.date
                });
            }
        });

        // Habits
        habitsStore.habits.forEach(habit => {
            if (habit.name.toLowerCase().includes(q)) {
                results.push({
                    id: habit.id,
                    type: 'Habit',
                    title: habit.name,
                    subtitle: `Streak: ${habit.streak} days`,
                    href: `${base}/habits`,
                    date: undefined
                });
            }
        });

        // Finance
        financeStore.transactions.forEach(t => {
            if (t.title.toLowerCase().includes(q) || t.type.toLowerCase().includes(q)) {
                results.push({
                    id: t.id,
                    type: 'Finance',
                    title: t.title,
                    subtitle: `${t.type === 'expense' ? '-' : '+'}$${t.amount} • ${t.type}`,
                    href: `${base}/finance`,
                    date: t.date
                });
            }
        });

        // Projects
        projectsStore.projects.forEach(p => {
            if (p.name.toLowerCase().includes(q)) {
                results.push({
                    id: p.id,
                    type: 'Project',
                    title: p.name,
                    subtitle: `${p.progress}% Complete`,
                    href: `${base}/para`,
                    date: undefined
                });
            }
        });

        // Library
        libraryStore.books.forEach(b => {
            if (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) {
                results.push({
                    id: b.id,
                    type: 'Book',
                    title: b.title,
                    subtitle: `by ${b.author} • ${b.status}`,
                    href: `${base}/library`,
                    date: undefined
                });
            }
        });

        // Nutrition
        nutritionStore.meals.forEach(m => {
            if (m.name.toLowerCase().includes(q)) {
                results.push({
                    id: m.id,
                    type: 'Nutrition',
                    title: m.name,
                    subtitle: `${m.calories} kcal • ${m.time}`,
                    href: `${base}/nutrition`,
                    date: undefined
                });
            }
        });

        // Fitness
        fitnessStore.workouts.forEach(w => {
            if (w.title.toLowerCase().includes(q)) {
                results.push({
                    id: w.id,
                    type: 'Fitness',
                    title: w.title,
                    subtitle: `${w.duration} • ${w.calories} cal`,
                    href: `${base}/fitness`,
                    date: w.date === 'Today' || w.date === 'Yesterday' ? undefined : w.date
                });
            }
        });

        // Notes
        notesStore.notes.forEach(n => {
            if (n.title.toLowerCase().includes(q) || (n.content && n.content.toLowerCase().includes(q))) {
                results.push({
                    id: n.id,
                    type: 'Note',
                    title: n.title,
                    subtitle: `${n.content ? n.content.substring(0, 30) + '...' : ''}`,
                    href: `${base}/notes`,
                    date: undefined
                });
            }
        });

        // Goals
        goalsStore.goals.forEach(g => {
            if (g.title.toLowerCase().includes(q)) {
                results.push({
                    id: g.id,
                    type: 'Goal',
                    title: g.title,
                    subtitle: `${goalsStore.getGoalProgress(g.id)}% • Deadline: ${g.deadline || 'No Deadline'}`,
                    href: `${base}/goals`,
                    date: undefined
                });
            }
        });

        // Journal
        journalStore.entries.forEach(j => {
            if (j.title.toLowerCase().includes(q) || (j.content && j.content.toLowerCase().includes(q))) {
                results.push({
                    id: j.id,
                    type: 'Journal',
                    title: j.title,
                    subtitle: `Mood: ${j.mood} • ${j.content.substring(0, 30)}...`,
                    href: `${base}/journal`,
                    date: undefined
                });
            }
        });

        return results;
    }

    open() {
        this.isOpen = true;
    }

    close() {
        this.isOpen = false;
        this.query = "";
    }
}

export const searchStore = new SearchStore();
