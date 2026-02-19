export interface IdentityTrait {
    id: string;
    userId?: string;
    name: string;
    description: string;
    createdAt?: string;
}

export interface IdentityAction {
    id: string;
    userId?: string;
    traitId: string | null;
    description: string;
    isAligned: boolean;
    reflection: string | null;
    createdAt?: string;
}
