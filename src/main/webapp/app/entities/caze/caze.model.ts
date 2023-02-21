import { IPlateau } from 'app/entities/plateau/plateau.model';

export interface ICaze {
  id: number;
  question?: string | null;
  absice?: number | null;
  ordo?: number | null;
  position?: number | null;
  plateau?: Pick<IPlateau, 'id'> | null;
}

export type NewCaze = Omit<ICaze, 'id'> & { id: null };
