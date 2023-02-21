import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { CazeFormService, CazeFormGroup } from './caze-form.service';
import { ICaze } from '../caze.model';
import { CazeService } from '../service/caze.service';
import { IPlateau } from 'app/entities/plateau/plateau.model';
import { PlateauService } from 'app/entities/plateau/service/plateau.service';

@Component({
  selector: 'jhi-caze-update',
  templateUrl: './caze-update.component.html',
})
export class CazeUpdateComponent implements OnInit {
  isSaving = false;
  caze: ICaze | null = null;

  plateausSharedCollection: IPlateau[] = [];

  editForm: CazeFormGroup = this.cazeFormService.createCazeFormGroup();

  constructor(
    protected cazeService: CazeService,
    protected cazeFormService: CazeFormService,
    protected plateauService: PlateauService,
    protected activatedRoute: ActivatedRoute
  ) {}

  comparePlateau = (o1: IPlateau | null, o2: IPlateau | null): boolean => this.plateauService.comparePlateau(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ caze }) => {
      this.caze = caze;
      if (caze) {
        this.updateForm(caze);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const caze = this.cazeFormService.getCaze(this.editForm);
    if (caze.id !== null) {
      this.subscribeToSaveResponse(this.cazeService.update(caze));
    } else {
      this.subscribeToSaveResponse(this.cazeService.create(caze));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ICaze>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(caze: ICaze): void {
    this.caze = caze;
    this.cazeFormService.resetForm(this.editForm, caze);

    this.plateausSharedCollection = this.plateauService.addPlateauToCollectionIfMissing<IPlateau>(
      this.plateausSharedCollection,
      caze.plateau
    );
  }

  protected loadRelationshipsOptions(): void {
    this.plateauService
      .query()
      .pipe(map((res: HttpResponse<IPlateau[]>) => res.body ?? []))
      .pipe(map((plateaus: IPlateau[]) => this.plateauService.addPlateauToCollectionIfMissing<IPlateau>(plateaus, this.caze?.plateau)))
      .subscribe((plateaus: IPlateau[]) => (this.plateausSharedCollection = plateaus));
  }
}
