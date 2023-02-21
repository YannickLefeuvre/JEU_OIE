import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ICaze } from 'app/entities/caze/caze.model';
import { IPlateau } from 'app/entities/plateau/plateau.model';
import { Couleur } from 'app/entities/enumerations/couleur.model';

export interface IJoueur {
  id: number;
  nom?: string | null;
  positions?: number | null;
  couleur?: Couleur | null;
  user?: Pick<IApplicationUser, 'id'> | null;
  caze?: Pick<ICaze, 'id'> | null;
  plateau?: Pick<IPlateau, 'id'> | null;
}

export type NewJoueur = Omit<IJoueur, 'id'> & { id: null };
