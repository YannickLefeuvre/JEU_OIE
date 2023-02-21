export interface IPlateau {
  id: number;
  nom?: string | null;
  image?: string | null;
  imageContentType?: string | null;
  nbQuestions?: number | null;
  principal?: boolean | null;
}

export type NewPlateau = Omit<IPlateau, 'id'> & { id: null };
