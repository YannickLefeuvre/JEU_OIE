import { IPlateau, NewPlateau } from './plateau.model';

export const sampleWithRequiredData: IPlateau = {
  id: 42269,
};

export const sampleWithPartialData: IPlateau = {
  id: 37225,
  nom: 'Senior primary',
  nbQuestions: 40021,
  principal: false,
};

export const sampleWithFullData: IPlateau = {
  id: 64876,
  nom: '9(E.U.A.-9) mobile Savings',
  image: '../fake-data/blob/hipster.png',
  imageContentType: 'unknown',
  nbQuestions: 87775,
  principal: false,
};

export const sampleWithNewData: NewPlateau = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
