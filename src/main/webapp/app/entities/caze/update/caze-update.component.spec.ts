import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { CazeFormService } from './caze-form.service';
import { CazeService } from '../service/caze.service';
import { ICaze } from '../caze.model';
import { IPlateau } from 'app/entities/plateau/plateau.model';
import { PlateauService } from 'app/entities/plateau/service/plateau.service';

import { CazeUpdateComponent } from './caze-update.component';

describe('Caze Management Update Component', () => {
  let comp: CazeUpdateComponent;
  let fixture: ComponentFixture<CazeUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let cazeFormService: CazeFormService;
  let cazeService: CazeService;
  let plateauService: PlateauService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [CazeUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(CazeUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(CazeUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    cazeFormService = TestBed.inject(CazeFormService);
    cazeService = TestBed.inject(CazeService);
    plateauService = TestBed.inject(PlateauService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Plateau query and add missing value', () => {
      const caze: ICaze = { id: 456 };
      const plateau: IPlateau = { id: 53986 };
      caze.plateau = plateau;

      const plateauCollection: IPlateau[] = [{ id: 6612 }];
      jest.spyOn(plateauService, 'query').mockReturnValue(of(new HttpResponse({ body: plateauCollection })));
      const additionalPlateaus = [plateau];
      const expectedCollection: IPlateau[] = [...additionalPlateaus, ...plateauCollection];
      jest.spyOn(plateauService, 'addPlateauToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ caze });
      comp.ngOnInit();

      expect(plateauService.query).toHaveBeenCalled();
      expect(plateauService.addPlateauToCollectionIfMissing).toHaveBeenCalledWith(
        plateauCollection,
        ...additionalPlateaus.map(expect.objectContaining)
      );
      expect(comp.plateausSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const caze: ICaze = { id: 456 };
      const plateau: IPlateau = { id: 6285 };
      caze.plateau = plateau;

      activatedRoute.data = of({ caze });
      comp.ngOnInit();

      expect(comp.plateausSharedCollection).toContain(plateau);
      expect(comp.caze).toEqual(caze);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICaze>>();
      const caze = { id: 123 };
      jest.spyOn(cazeFormService, 'getCaze').mockReturnValue(caze);
      jest.spyOn(cazeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caze });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: caze }));
      saveSubject.complete();

      // THEN
      expect(cazeFormService.getCaze).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(cazeService.update).toHaveBeenCalledWith(expect.objectContaining(caze));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICaze>>();
      const caze = { id: 123 };
      jest.spyOn(cazeFormService, 'getCaze').mockReturnValue({ id: null });
      jest.spyOn(cazeService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caze: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: caze }));
      saveSubject.complete();

      // THEN
      expect(cazeFormService.getCaze).toHaveBeenCalled();
      expect(cazeService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<ICaze>>();
      const caze = { id: 123 };
      jest.spyOn(cazeService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ caze });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(cazeService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('comparePlateau', () => {
      it('Should forward to plateauService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(plateauService, 'comparePlateau');
        comp.comparePlateau(entity, entity2);
        expect(plateauService.comparePlateau).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
