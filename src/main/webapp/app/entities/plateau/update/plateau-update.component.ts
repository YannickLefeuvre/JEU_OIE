import { Component, OnInit, ElementRef } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { PlateauFormService, PlateauFormGroup } from './plateau-form.service';
import { IPlateau } from '../plateau.model';
import { PlateauService } from '../service/plateau.service';
import { AlertError } from 'app/shared/alert/alert-error.model';
import { EventManager, EventWithContent } from 'app/core/util/event-manager.service';
import { DataUtils, FileLoadError } from 'app/core/util/data-util.service';

@Component({
  selector: 'jhi-plateau-update',
  templateUrl: './plateau-update.component.html',
})
export class PlateauUpdateComponent implements OnInit {
  isSaving = false;
  plateau: IPlateau | null = null;

  editForm: PlateauFormGroup = this.plateauFormService.createPlateauFormGroup();

  constructor(
    protected dataUtils: DataUtils,
    protected eventManager: EventManager,
    protected plateauService: PlateauService,
    protected plateauFormService: PlateauFormService,
    protected elementRef: ElementRef,
    protected activatedRoute: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ plateau }) => {
      this.plateau = plateau;
      if (plateau) {
        this.updateForm(plateau);
      }
    });
  }

  byteSize(base64String: string): string {
    return this.dataUtils.byteSize(base64String);
  }

  openFile(base64String: string, contentType: string | null | undefined): void {
    this.dataUtils.openFile(base64String, contentType);
  }

  setFileData(event: Event, field: string, isImage: boolean): void {
    this.dataUtils.loadFileToForm(event, this.editForm, field, isImage).subscribe({
      error: (err: FileLoadError) =>
        this.eventManager.broadcast(new EventWithContent<AlertError>('elitysApp.error', { ...err, key: 'error.file.' + err.key })),
    });
  }

  clearInputImage(field: string, fieldContentType: string, idInput: string): void {
    this.editForm.patchValue({
      [field]: null,
      [fieldContentType]: null,
    });
    if (idInput && this.elementRef.nativeElement.querySelector('#' + idInput)) {
      this.elementRef.nativeElement.querySelector('#' + idInput).value = null;
    }
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const plateau = this.plateauFormService.getPlateau(this.editForm);
    if (plateau.id !== null) {
      this.subscribeToSaveResponse(this.plateauService.update(plateau));
    } else {
      this.subscribeToSaveResponse(this.plateauService.create(plateau));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IPlateau>>): void {
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

  protected updateForm(plateau: IPlateau): void {
    this.plateau = plateau;
    this.plateauFormService.resetForm(this.editForm, plateau);
  }
}
