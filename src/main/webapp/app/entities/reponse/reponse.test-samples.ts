import { IReponse, NewReponse } from './reponse.model';

export const sampleWithRequiredData: IReponse = {
  id: 6123,
};

export const sampleWithPartialData: IReponse = {
  id: 91946,
  question: 'Pula bus',
  reponse: 'Vermont',
};

export const sampleWithFullData: IReponse = {
  id: 14295,
  question: 'Wooden ADP',
  reponse: 'streamline',
};

export const sampleWithNewData: NewReponse = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
