import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize, map } from 'rxjs/operators';

import { JoueurFormService, JoueurFormGroup } from './joueur-form.service';
import { IJoueur } from '../joueur.model';
import { JoueurService } from '../service/joueur.service';
import { IApplicationUser } from 'app/entities/application-user/application-user.model';
import { ApplicationUserService } from 'app/entities/application-user/service/application-user.service';
import { ICaze } from 'app/entities/caze/caze.model';
import { CazeService } from 'app/entities/caze/service/caze.service';
import { IPlateau } from 'app/entities/plateau/plateau.model';
import { PlateauService } from 'app/entities/plateau/service/plateau.service';
import { Couleur } from 'app/entities/enumerations/couleur.model';

@Component({
  selector: 'jhi-joueur-update',
  templateUrl: './joueur-update.component.html',
})
export class JoueurUpdateComponent implements OnInit {
  isSaving = false;
  joueur: IJoueur | null = null;
  couleurValues = Object.keys(Couleur);

  applicationUsersSharedCollection: IApplicationUser[] = [];
  cazesSharedCollection: ICaze[] = [];
  plateausSharedCollection: IPlateau[] = [];

  editForm: JoueurFormGroup = this.joueurFormService.createJoueurFormGroup();

  constructor(
    protected joueurService: JoueurService,
    protected joueurFormService: JoueurFormService,
    protected applicationUserService: ApplicationUserService,
    protected cazeService: CazeService,
    protected plateauService: PlateauService,
    protected activatedRoute: ActivatedRoute
  ) {}

  compareApplicationUser = (o1: IApplicationUser | null, o2: IApplicationUser | null): boolean =>
    this.applicationUserService.compareApplicationUser(o1, o2);

  compareCaze = (o1: ICaze | null, o2: ICaze | null): boolean => this.cazeService.compareCaze(o1, o2);

  comparePlateau = (o1: IPlateau | null, o2: IPlateau | null): boolean => this.plateauService.comparePlateau(o1, o2);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ joueur }) => {
      this.joueur = joueur;
      if (joueur) {
        this.updateForm(joueur);
      }

      this.loadRelationshipsOptions();
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const joueur = this.joueurFormService.getJoueur(this.editForm);
    if (joueur.id !== null) {
      this.subscribeToSaveResponse(this.joueurService.update(joueur));
    } else {
      this.subscribeToSaveResponse(this.joueurService.create(joueur));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IJoueur>>): void {
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

  protected updateForm(joueur: IJoueur): void {
    this.joueur = joueur;
    this.joueurFormService.resetForm(this.editForm, joueur);

    this.applicationUsersSharedCollection = this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(
      this.applicationUsersSharedCollection,
      joueur.user
    );
    this.cazesSharedCollection = this.cazeService.addCazeToCollectionIfMissing<ICaze>(this.cazesSharedCollection, joueur.caze);
    this.plateausSharedCollection = this.plateauService.addPlateauToCollectionIfMissing<IPlateau>(
      this.plateausSharedCollection,
      joueur.plateau
    );
  }

  protected loadRelationshipsOptions(): void {
    this.applicationUserService
      .query()
      .pipe(map((res: HttpResponse<IApplicationUser[]>) => res.body ?? []))
      .pipe(
        map((applicationUsers: IApplicationUser[]) =>
          this.applicationUserService.addApplicationUserToCollectionIfMissing<IApplicationUser>(applicationUsers, this.joueur?.user)
        )
      )
      .subscribe((applicationUsers: IApplicationUser[]) => (this.applicationUsersSharedCollection = applicationUsers));

    this.cazeService
      .query()
      .pipe(map((res: HttpResponse<ICaze[]>) => res.body ?? []))
      .pipe(map((cazes: ICaze[]) => this.cazeService.addCazeToCollectionIfMissing<ICaze>(cazes, this.joueur?.caze)))
      .subscribe((cazes: ICaze[]) => (this.cazesSharedCollection = cazes));

    this.plateauService
      .query()
      .pipe(map((res: HttpResponse<IPlateau[]>) => res.body ?? []))
      .pipe(map((plateaus: IPlateau[]) => this.plateauService.addPlateauToCollectionIfMissing<IPlateau>(plateaus, this.joueur?.plateau)))
      .subscribe((plateaus: IPlateau[]) => (this.plateausSharedCollection = plateaus));
  }
}
