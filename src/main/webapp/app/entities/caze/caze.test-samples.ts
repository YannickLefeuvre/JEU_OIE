import { ICaze, NewCaze } from './caze.model';

export const sampleWithRequiredData: ICaze = {
  id: 54731,
};

export const sampleWithPartialData: ICaze = {
  id: 9527,
  question: 'RAM deposit drive',
  absice: 27419,
  position: 21840,
};

export const sampleWithFullData: ICaze = {
  id: 83887,
  question: 'program Concrete',
  absice: 10206,
  ordo: 24598,
  position: 96484,
};

export const sampleWithNewData: NewCaze = {
  id: null,
};

Object.freeze(sampleWithNewData);
Object.freeze(sampleWithRequiredData);
Object.freeze(sampleWithPartialData);
Object.freeze(sampleWithFullData);
