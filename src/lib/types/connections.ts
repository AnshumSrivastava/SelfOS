export interface Connection {
    id: string;
    userId?: string;
    name: string;
    contactInfo?: string | null;
    relationshipGoals?: string | null;
    categories?: string[];
    lastContactedAt?: string | null;
    goalId?: string | null;
    projectId?: string | null;
    createdAt?: string;
}
