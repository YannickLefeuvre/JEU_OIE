import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ICaze } from '../caze.model';
import { sampleWithRequiredData, sampleWithNewData, sampleWithPartialData, sampleWithFullData } from '../caze.test-samples';

import { CazeService } from './caze.service';

const requireRestSample: ICaze = {
  ...sampleWithRequiredData,
};

describe('Caze Service', () => {
  let service: CazeService;
  let httpMock: HttpTestingController;
  let expectedResult: ICaze | ICaze[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(CazeService);
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

    it('should create a Caze', () => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const caze = { ...sampleWithNewData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.create(caze).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Caze', () => {
      const caze = { ...sampleWithRequiredData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.update(caze).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Caze', () => {
      const patchObject = { ...sampleWithPartialData };
      const returnedFromService = { ...requireRestSample };
      const expected = { ...sampleWithRequiredData };

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Caze', () => {
      const returnedFromService = { ...requireRestSample };

      const expected = { ...sampleWithRequiredData };

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toMatchObject([expected]);
    });

    it('should delete a Caze', () => {
      const expected = true;

      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult).toBe(expected);
    });

    describe('addCazeToCollectionIfMissing', () => {
      it('should add a Caze to an empty array', () => {
        const caze: ICaze = sampleWithRequiredData;
        expectedResult = service.addCazeToCollectionIfMissing([], caze);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(caze);
      });

      it('should not add a Caze to an array that contains it', () => {
        const caze: ICaze = sampleWithRequiredData;
        const cazeCollection: ICaze[] = [
          {
            ...caze,
          },
          sampleWithPartialData,
        ];
        expectedResult = service.addCazeToCollectionIfMissing(cazeCollection, caze);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Caze to an array that doesn't contain it", () => {
        const caze: ICaze = sampleWithRequiredData;
        const cazeCollection: ICaze[] = [sampleWithPartialData];
        expectedResult = service.addCazeToCollectionIfMissing(cazeCollection, caze);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(caze);
      });

      it('should add only unique Caze to an array', () => {
        const cazeArray: ICaze[] = [sampleWithRequiredData, sampleWithPartialData, sampleWithFullData];
        const cazeCollection: ICaze[] = [sampleWithRequiredData];
        expectedResult = service.addCazeToCollectionIfMissing(cazeCollection, ...cazeArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const caze: ICaze = sampleWithRequiredData;
        const caze2: ICaze = sampleWithPartialData;
        expectedResult = service.addCazeToCollectionIfMissing([], caze, caze2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(caze);
        expect(expectedResult).toContain(caze2);
      });

      it('should accept null and undefined values', () => {
        const caze: ICaze = sampleWithRequiredData;
        expectedResult = service.addCazeToCollectionIfMissing([], null, caze, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(caze);
      });

      it('should return initial array if no Caze is added', () => {
        const cazeCollection: ICaze[] = [sampleWithRequiredData];
        expectedResult = service.addCazeToCollectionIfMissing(cazeCollection, undefined, null);
        expect(expectedResult).toEqual(cazeCollection);
      });
    });

    describe('compareCaze', () => {
      it('Should return true if both entities are null', () => {
        const entity1 = null;
        const entity2 = null;

        const compareResult = service.compareCaze(entity1, entity2);

        expect(compareResult).toEqual(true);
      });

      it('Should return false if one entity is null', () => {
        const entity1 = { id: 123 };
        const entity2 = null;

        const compareResult1 = service.compareCaze(entity1, entity2);
        const compareResult2 = service.compareCaze(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey differs', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 456 };

        const compareResult1 = service.compareCaze(entity1, entity2);
        const compareResult2 = service.compareCaze(entity2, entity1);

        expect(compareResult1).toEqual(false);
        expect(compareResult2).toEqual(false);
      });

      it('Should return false if primaryKey matches', () => {
        const entity1 = { id: 123 };
        const entity2 = { id: 123 };

        const compareResult1 = service.compareCaze(entity1, entity2);
        const compareResult2 = service.compareCaze(entity2, entity1);

        expect(compareResult1).toEqual(true);
        expect(compareResult2).toEqual(true);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});
