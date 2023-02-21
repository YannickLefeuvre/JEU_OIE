import { Couleur } from 'app/entities/enumerations/couleur.model';

import { IJoueur, NewJoueur } from './joueur.model';

export const sampleWithRequiredData: IJoueur = {
  id: 35154,
};

export const sampleWithPartialData: IJoueur = {
  id: 43798,
  nom: 'Beauty Strategist',
  positions: 62253,
};

export const sampleWithFullData: IJoueur = {
  id: 81896,
  nom: 'orange benchmark Chair',
  positions: 3077,
  couleur: Couleur['VIOLET'],
};

export const sampleWithNewData: NewJoueur = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
