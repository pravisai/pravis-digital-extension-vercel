

export type Email = {
    id: string;
    subject: string;
    body: string;
    date: string;
    read: boolean;
    sender: string;
    email: string;
    labelIds?: string[];
};
