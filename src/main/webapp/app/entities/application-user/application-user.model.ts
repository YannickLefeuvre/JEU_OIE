import { IUser } from 'app/entities/user/user.model';

export interface IApplicationUser {
  id: number;
  nom?: string | null;
  internalUser?: Pick<IUser, 'id'> | null;
}

export type NewApplicationUser = Omit<IApplicationUser, 'id'> & { id: null };
