import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IPlateau } from '../plateau.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../plateau.test-samples';

import { PlateauService } from './plateau.service';

const requireRestSample: IPlateau = {
  ...sampleWithRequiredData,
};

describe('Plateau Service', () => {
  let service: PlateauService;
  let httpMock: HttpTestingController;
  let expectedResult: IPlateau | IPlateau[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(PlateauService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should create a Plateau', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const plateau = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(plateau).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Plateau', () => {
      const plateau = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(plateau).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Plateau', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Plateau', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Plateau', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addPlateauToCollectionIfMissing', () => {
      it('should add a Plateau to an empty array', () => {
        const plateau: IPlateau = sampleWithRequiredData;
        expectedResult = service.addPlateauToCollectionIfMissing([], plateau);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(plateau);
      });

      it('should not add a Plateau to an array that contains it', () => {
        const plateau: IPlateau = sampleWithRequiredData;
        const plateauCollection: IPlateau[] = [
          {
            ...plateau,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addPlateauToCollectionIfMissing(plateauCollection, plateau);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Plateau to an array that doesn't contain it", () => {
        const plateau: IPlateau = sampleWithRequiredData;
        const plateauCollection: IPlateau[] = [sampleWithPartialData];
        expectedResult = service.addPlateauToCollectionIfMissing(plateauCollection, plateau);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(plateau);
      });

      it('should add only unique Plateau to an array', () => {
        const plateauArray: IPlateau[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const plateauCollection: IPlateau[] = [sampleWithRequiredData];
        expectedResult = service.addPlateauToCollectionIfMissing(plateauCollection, ...plateauArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const plateau: IPlateau = sampleWithRequiredData;
        const plateau2: IPlateau = sampleWithPartialData;
        expectedResult = service.addPlateauToCollectionIfMissing([], plateau, plateau2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(plateau);
        expect(expectedResult).toContain(plateau2);
      });

      it('should accept null and undefined values', () => {
        const plateau: IPlateau = sampleWithRequiredData;
        expectedResult = service.addPlateauToCollectionIfMissing([], null, plateau, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(plateau);
      });

      it('should return initial array if no Plateau is added', () => {
        const plateauCollection: IPlateau[] = [sampleWithRequiredData];
        expectedResult = service.addPlateauToCollectionIfMissing(plateauCollection, undefined, null);
        expect(expectedResult).toEqual(plateauCollection);
      });
    });

    describe('comparePlateau', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.comparePlateau(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.comparePlateau(entity1, entity2);
        const compareResult2 = service.comparePlateau(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.comparePlateau(entity1, entity2);
        const compareResult2 = service.comparePlateau(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.comparePlateau(entity1, entity2);
        const compareResult2 = service.comparePlateau(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
