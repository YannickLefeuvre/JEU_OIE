import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IPlateau, NewPlateau } from '../plateau.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IPlateau for edit and NewPlateauFormGroupInput for create.
 */
type PlateauFormGroupInput = IPlateau | PartialWithRequiredKeyOf<NewPlateau>;

type PlateauFormDefaults = Pick<NewPlateau, 'id' | 'principal'>;

type PlateauFormGroupContent = {
  id: FormControl<IPlateau['id'] | NewPlateau['id']>;
  nom: FormControl<IPlateau['nom']>;
  image: FormControl<IPlateau['image']>;
  imageContentType: FormControl<IPlateau['imageContentType']>;
  nbQuestions: FormControl<IPlateau['nbQuestions']>;
  principal: FormControl<IPlateau['principal']>;
};

export type PlateauFormGroup = FormGroup<PlateauFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class PlateauFormService {
  createPlateauFormGroup(plateau: PlateauFormGroupInput = { id: null }): PlateauFormGroup {
    const plateauRawValue = {
      ...this.getFormDefaults(),
      ...plateau,
    };
    return new FormGroup<PlateauFormGroupContent>({
      id: new FormControl(
        { value: plateauRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(plateauRawValue.nom),
      image: new FormControl(plateauRawValue.image),
      imageContentType: new FormControl(plateauRawValue.imageContentType),
      nbQuestions: new FormControl(plateauRawValue.nbQuestions),
      principal: new FormControl(plateauRawValue.principal),
    });
  }

  getPlateau(form: PlateauFormGroup): IPlateau | NewPlateau {
    return form.getRawValue() as IPlateau | NewPlateau;
  }

  resetForm(form: PlateauFormGroup, plateau: PlateauFormGroupInput): void {
    const plateauRawValue = { ...this.getFormDefaults(), ...plateau };
    form.reset(
      {
        ...plateauRawValue,
        id: { value: plateauRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): PlateauFormDefaults {
    return {
      id: null,
      principal: false,
    };
  }
}
