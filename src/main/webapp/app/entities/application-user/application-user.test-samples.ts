import { IApplicationUser, NewApplicationUser } from './application-user.model';

export const sampleWithRequiredData: IApplicationUser = {
  id: 60827,
};

export const sampleWithPartialData: IApplicationUser = {
  id: 95279,
};

export const sampleWithFullData: IApplicationUser = {
  id: 82117,
  nom: 'California neutral Coordinator',
};

export const sampleWithNewData: NewApplicationUser = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
