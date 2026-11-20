export type Note = {
    id: string;
    phrase: string;
    correction: string;
    example: string;
    date: string;
    practiced: number;
    learned: boolean;
};

export type Turn = {
    said: string;
    corrected: string;
    reason: string;
    reply: string;
};
  
export type Scene = {
    id: string;
    label: string;
    you: string;
    partner: string;
    opening: string;
    turns: Turn[];
};