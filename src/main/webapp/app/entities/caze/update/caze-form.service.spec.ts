import { TestBed } from '@angular/core/testing';

import { sampleWithRequiredData, sampleWithNewData } from '../caze.test-samples';

import { CazeFormService } from './caze-form.service';

describe('Caze Form Service', () => {
  let service: CazeFormService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CazeFormService);
  });

  describe('Service methods', () => {
    describe('createCazeFormGroup', () => {
      it('should create a new form with FormControl', () => {
        const formGroup = service.createCazeFormGroup();

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            question: expect.any(Object),
            absice: expect.any(Object),
            ordo: expect.any(Object),
            position: expect.any(Object),
            plateau: expect.any(Object),
          })
        );
      });

      it('passing ICaze should create a new form with FormGroup', () => {
        const formGroup = service.createCazeFormGroup(sampleWithRequiredData);

        expect(formGroup.controls).toEqual(
          expect.objectContaining({
            id: expect.any(Object),
            question: expect.any(Object),
            absice: expect.any(Object),
            ordo: expect.any(Object),
            position: expect.any(Object),
            plateau: expect.any(Object),
          })
        );
      });
    });

    describe('getCaze', () => {
      it('should return NewCaze for default Caze initial value', () => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const formGroup = service.createCazeFormGroup(sampleWithNewData);

        const caze = service.getCaze(formGroup) as any;

        expect(caze).toMatchObject(sampleWithNewData);
      });

      it('should return NewCaze for empty Caze initial value', () => {
        const formGroup = service.createCazeFormGroup();

        const caze = service.getCaze(formGroup) as any;

        expect(caze).toMatchObject({});
      });

      it('should return ICaze', () => {
        const formGroup = service.createCazeFormGroup(sampleWithRequiredData);

        const caze = service.getCaze(formGroup) as any;

        expect(caze).toMatchObject(sampleWithRequiredData);
      });
    });

    describe('resetForm', () => {
      it('passing ICaze should not enable id FormControl', () => {
        const formGroup = service.createCazeFormGroup();
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, sampleWithRequiredData);

        expect(formGroup.controls.id.disabled).toBe(true);
      });

      it('passing NewCaze should disable id FormControl', () => {
        const formGroup = service.createCazeFormGroup(sampleWithRequiredData);
        expect(formGroup.controls.id.disabled).toBe(true);

        service.resetForm(formGroup, { id: null });

        expect(formGroup.controls.id.disabled).toBe(true);
      });
    });
  });
});
