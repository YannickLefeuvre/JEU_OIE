import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';

import { ReponseService } from '../service/reponse.service';

import { ReponseComponent } from './reponse.component';

describe('Reponse Management Component', () => {
  let comp: ReponseComponent;
  let fixture: ComponentFixture<ReponseComponent>;
  let service: ReponseService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [RouterTestingModule.withRoutes([{ path: 'reponse', component: ReponseComponent }]), HttpClientTestingModule],
      declarations: [ReponseComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            data: of({
              defaultSort: 'id,asc',
            }),
            queryParamMap: of(
              jest.requireActual('@angular/router').convertToParamMap({
                page: '1',
                size: '1',
                sort: 'id,desc',
              })
            ),
            snapshot: { queryParams: {} },
          },
        },
      ],
    })
      .overrideTemplate(ReponseComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(ReponseComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(ReponseService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.reponses?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });

  describe('trackId', () => {
    it('Should forward to reponseService', () => {
      const entity = { id: 123 };
      jest.spyOn(service, 'getReponseIdentifier');
      const id = comp.trackId(0, entity);
      expect(service.getReponseIdentifier).toHaveBeenCalledWith(entity);
      expect(id).toBe(entity.id);
    });
  });
});
