import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { ReponseFormService, ReponseFormGroup } from './reponse-form.service';
import { IReponse } from '../reponse.model';
import { ReponseService } from '../service/reponse.service';
import { IJoueur } from 'app/entities/joueur/joueur.model';
import { JoueurService } from 'app/entities/joueur/service/joueur.service';

@Component({
  selector: 'jhi-reponse-update',
  templateUrl: './reponse-update.component.html',
})
export class ReponseUpdateComponent implements OnInit {
  isSaving = false;
  reponse: IReponse | null = null;

  joueursSharedCollection: IJoueur[] = [];

  editForm: ReponseFormGroup = this.reponseFormService.createReponseFormGroup();

  constructor(
    protected reponseService: ReponseService,
    protected reponseFormService: ReponseFormService,
    protected joueurService: JoueurService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareJoueur = (o1: IJoueur | null, o2: IJoueur | null): boolean => this.joueurService.compareJoueur(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ reponse }) => {
      this.reponse = reponse;
      if (reponse) {
        this.updateForm(reponse);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const reponse = this.reponseFormService.getReponse(this.editForm);
    if (reponse.id !== null) {
      this.subscribeToSaveResponse(this.reponseService.update(reponse));
    } else {
      this.subscribeToSaveResponse(this.reponseService.create(reponse));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IReponse>>): void {
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

  protected updateForm(reponse: IReponse): void {
    this.reponse = reponse;
    this.reponseFormService.resetForm(this.editForm, reponse);

    this.joueursSharedCollection = this.joueurService.addJoueurToCollectionIfMissing<IJoueur>(this.joueursSharedCollection, reponse.user);
  }

  protected loadRelationshipsOptions(): void {
    this.joueurService
      .query()
      .pipe(map((res: HttpResponse<IJoueur[]>) => res.body ?? []))
      .pipe(map((joueurs: IJoueur[]) => this.joueurService.addJoueurToCollectionIfMissing<IJoueur>(joueurs, this.reponse?.user)))
      .subscribe((joueurs: IJoueur[]) => (this.joueursSharedCollection = joueurs));
  }
}
