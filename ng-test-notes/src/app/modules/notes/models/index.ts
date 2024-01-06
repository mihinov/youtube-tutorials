export interface NotesItem {
	id: string;
	title: string;
	description: string;
}

export interface AddedNotesItem {
	title: string;
	description: string;
}

export interface isEmptyNotes {
	isEmpty: boolean;
}

export interface NotesItemDeleteInfo {
	isEmptyNotes: boolean;
	nextActiveId: string | null;
}
