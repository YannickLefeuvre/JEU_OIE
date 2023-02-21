import { IJoueur } from 'app/entities/joueur/joueur.model';

export interface IReponse {
  id: number;
  question?: string | null;
  reponse?: string | null;
  user?: Pick<IJoueur, 'id'> | null;
}

export type NewReponse = Omit<IReponse, 'id'> & { id: null };
