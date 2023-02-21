import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { ReponseFormService } from './reponse-form.service';
import { ReponseService } from '../service/reponse.service';
import { IReponse } from '../reponse.model';
import { IJoueur } from 'app/entities/joueur/joueur.model';
import { JoueurService } from 'app/entities/joueur/service/joueur.service';

import { ReponseUpdateComponent } from './reponse-update.component';

describe('Reponse Management Update Component', () => {
  let comp: ReponseUpdateComponent;
  let fixture: ComponentFixture<ReponseUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let reponseFormService: ReponseFormService;
  let reponseService: ReponseService;
  let joueurService: JoueurService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [ReponseUpdateComponent],
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
      .overrideTemplate(ReponseUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReponseUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    reponseFormService = TestBed.inject(ReponseFormService);
    reponseService = TestBed.inject(ReponseService);
    joueurService = TestBed.inject(JoueurService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should call Joueur query and add missing value', () => {
      const reponse: IReponse = { id: 456 };
      const user: IJoueur = { id: 75527 };
      reponse.user = user;

      const joueurCollection: IJoueur[] = [{ id: 68319 }];
      jest.spyOn(joueurService, 'query').mockReturnValue(of(new HttpResponse({ body: joueurCollection })));
      const additionalJoueurs = [user];
      const expectedCollection: IJoueur[] = [...additionalJoueurs, ...joueurCollection];
      jest.spyOn(joueurService, 'addJoueurToCollectionIfMissing').mockReturnValue(expectedCollection);

      activatedRoute.data = of({ reponse });
      comp.ngOnInit();

      expect(joueurService.query).toHaveBeenCalled();
      expect(joueurService.addJoueurToCollectionIfMissing).toHaveBeenCalledWith(
        joueurCollection,
        ...additionalJoueurs.map(expect.objectContaining)
      );
      expect(comp.joueursSharedCollection).toEqual(expectedCollection);
    });

    it('Should update editForm', () => {
      const reponse: IReponse = { id: 456 };
      const user: IJoueur = { id: 30284 };
      reponse.user = user;

      activatedRoute.data = of({ reponse });
      comp.ngOnInit();

      expect(comp.joueursSharedCollection).toContain(user);
      expect(comp.reponse).toEqual(reponse);
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReponse>>();
      const reponse = { id: 123 };
      jest.spyOn(reponseFormService, 'getReponse').mockReturnValue(reponse);
      jest.spyOn(reponseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reponse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reponse }));
      saveSubject.complete();

      // THEN
      expect(reponseFormService.getReponse).toHaveBeenCalled();
      expect(comp.previousState).toHaveBeenCalled();
      expect(reponseService.update).toHaveBeenCalledWith(expect.objectContaining(reponse));
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReponse>>();
      const reponse = { id: 123 };
      jest.spyOn(reponseFormService, 'getReponse').mockReturnValue({ id: null });
      jest.spyOn(reponseService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reponse: null });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: reponse }));
      saveSubject.complete();

      // THEN
      expect(reponseFormService.getReponse).toHaveBeenCalled();
      expect(reponseService.create).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<IReponse>>();
      const reponse = { id: 123 };
      jest.spyOn(reponseService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ reponse });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(reponseService.update).toHaveBeenCalled();
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });

  describe('Compare relationships', () => {
    describe('compareJoueur', () => {
      it('Should forward to joueurService', () => {
        const entity = { id: 123 };
        const entity2 = { id: 456 };
        jest.spyOn(joueurService, 'compareJoueur');
        comp.compareJoueur(entity, entity2);
        expect(joueurService.compareJoueur).toHaveBeenCalledWith(entity, entity2);
      });
    });
  });
});
