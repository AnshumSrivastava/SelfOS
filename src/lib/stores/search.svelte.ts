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

    results = $derived.by(() => {
        const q = this.query.trim().toLowerCase();
        if (q.length < 2) return [];

        const results: SearchResult[] = [];

        this.addNavigationResults(results, q);
        this.addTutorialResults(results, q);
        this.addTaskResults(results, q);
        this.addCalendarResults(results, q);
        this.addHabitResults(results, q);
        this.addFinanceResults(results, q);
        this.addProjectResults(results, q);
        this.addLibraryResults(results, q);
        this.addNutritionResults(results, q);
        this.addFitnessResults(results, q);
        this.addNoteResults(results, q);
        this.addGoalResults(results, q);
        this.addJournalResults(results, q);

        return results;
    });

    private addNavigationResults(results: SearchResult[], q: string) {
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
    }

    private addTutorialResults(results: SearchResult[], q: string) {
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
                    href: '#'
                });
            }
        });
    }

    private addTaskResults(results: SearchResult[], q: string) {
        tasksStore.tasks.forEach(task => {
            if (task.title.toLowerCase().includes(q)) {
                results.push({
                    id: task.id,
                    type: 'Task',
                    title: task.title,
                    subtitle: `Due: ${task.deadline ? new Date(task.deadline).toLocaleDateString() : 'No Date'}`,
                    href: `${base}/tasks`,
                    date: task.createdAt
                });
            }
        });
    }

    private addCalendarResults(results: SearchResult[], q: string) {
        calendarStore.events.forEach(event => {
            if (event.title.toLowerCase().includes(q)) {
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
    }

    private addHabitResults(results: SearchResult[], q: string) {
        habitsStore.habits.forEach(habit => {
            if (habit.name.toLowerCase().includes(q)) {
                results.push({
                    id: habit.id,
                    type: 'Habit',
                    title: habit.name,
                    subtitle: `Streak: ${habit.streak} days`,
                    href: `${base}/habits`
                });
            }
        });
    }

    private addFinanceResults(results: SearchResult[], q: string) {
        financeStore.transactions.forEach(t => {
            if (t.title.toLowerCase().includes(q)) {
                results.push({
                    id: t.id,
                    type: 'Finance',
                    title: t.title,
                    subtitle: `${t.type === 'expense' ? '-' : '+'}${t.amount} • ${t.category}`,
                    href: `${base}/finance`,
                    date: t.date
                });
            }
        });
    }

    private addProjectResults(results: SearchResult[], q: string) {
        projectsStore.projects.forEach(p => {
            const matchName = p.name.toLowerCase().includes(q);
            const matchIntent = p.intent?.toLowerCase().includes(q);

            if (matchName || matchIntent) {
                results.push({
                    id: p.id,
                    type: 'Project',
                    title: p.name,
                    subtitle: matchIntent ? `Intent: ${p.intent}` : `${p.progress}% Complete`,
                    href: `${base}/para`
                });
            }
        });
    }

    private addLibraryResults(results: SearchResult[], q: string) {
        libraryStore.books.forEach(b => {
            if (b.title.toLowerCase().includes(q) || b.author.toLowerCase().includes(q)) {
                results.push({
                    id: b.id,
                    type: 'Book',
                    title: b.title,
                    subtitle: `by ${b.author}`,
                    href: `${base}/library`
                });
            }
        });
    }

    private addNutritionResults(results: SearchResult[], q: string) {
        nutritionStore.meals.forEach(m => {
            if (m.name.toLowerCase().includes(q)) {
                results.push({
                    id: m.id,
                    type: 'Nutrition',
                    title: m.name,
                    subtitle: `${m.calories} kcal`,
                    href: `${base}/nutrition`
                });
            }
        });
    }

    private addFitnessResults(results: SearchResult[], q: string) {
        fitnessStore.workouts.forEach(w => {
            if (w.title.toLowerCase().includes(q)) {
                results.push({
                    id: w.id,
                    type: 'Fitness',
                    title: w.title,
                    subtitle: `${w.duration}`,
                    href: `${base}/fitness`
                });
            }
        });
    }

    private addNoteResults(results: SearchResult[], q: string) {
        notesStore.notes.forEach(n => {
            const matchTitle = n.title.toLowerCase().includes(q);
            const matchContent = n.content?.toLowerCase().includes(q);
            const matchTags = n.tags?.some(t => t.toLowerCase().includes(q));

            if (matchTitle || matchContent || matchTags) {
                let subtitle = '';
                if (matchTags) {
                    subtitle = `Tags: ${n.tags.join(', ')}`;
                } else if (matchContent) {
                    const idx = n.content.toLowerCase().indexOf(q);
                    const start = Math.max(0, idx - 15);
                    subtitle = '...' + n.content.substring(start, start + 40) + '...';
                } else {
                    subtitle = n.content ? n.content.substring(0, 30) + '...' : 'Empty note';
                }

                results.push({
                    id: n.id,
                    type: 'Note',
                    title: n.title,
                    subtitle,
                    href: `${base}/notes`
                });
            }
        });
    }

    private addGoalResults(results: SearchResult[], q: string) {
        goalsStore.goals.forEach(g => {
            if (g.title.toLowerCase().includes(q)) {
                results.push({
                    id: g.id,
                    type: 'Goal',
                    title: g.title,
                    subtitle: `${goalsStore.getGoalProgress(g.id)}% • ${g.area}`,
                    href: `${base}/goals`
                });
            }
        });
    }

    private addJournalResults(results: SearchResult[], q: string) {
        journalStore.entries.forEach(j => {
            if (j.title.toLowerCase().includes(q) || (j.content && j.content.toLowerCase().includes(q))) {
                results.push({
                    id: j.id,
                    type: 'Journal',
                    title: j.title || 'Untitled Entry',
                    subtitle: j.date,
                    href: `${base}/journal`
                });
            }
        });
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
