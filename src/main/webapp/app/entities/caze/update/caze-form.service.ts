import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { ICaze, NewCaze } from '../caze.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts ICaze for edit and NewCazeFormGroupInput for create.
 */
type CazeFormGroupInput = ICaze | PartialWithRequiredKeyOf<NewCaze>;

type CazeFormDefaults = Pick<NewCaze, 'id'>;

type CazeFormGroupContent = {
  id: FormControl<ICaze['id'] | NewCaze['id']>;
  question: FormControl<ICaze['question']>;
  absice: FormControl<ICaze['absice']>;
  ordo: FormControl<ICaze['ordo']>;
  position: FormControl<ICaze['position']>;
  plateau: FormControl<ICaze['plateau']>;
};

export type CazeFormGroup = FormGroup<CazeFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class CazeFormService {
  createCazeFormGroup(caze: CazeFormGroupInput = { id: null }): CazeFormGroup {
    const cazeRawValue = {
      ...this.getFormDefaults(),
      ...caze,
    };
    return new FormGroup<CazeFormGroupContent>({
      id: new FormControl(
        { value: cazeRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      question: new FormControl(cazeRawValue.question),
      absice: new FormControl(cazeRawValue.absice),
      ordo: new FormControl(cazeRawValue.ordo),
      position: new FormControl(cazeRawValue.position),
      plateau: new FormControl(cazeRawValue.plateau),
    });
  }

  getCaze(form: CazeFormGroup): ICaze | NewCaze {
    return form.getRawValue() as ICaze | NewCaze;
  }

  resetForm(form: CazeFormGroup, caze: CazeFormGroupInput): void {
    const cazeRawValue = { ...this.getFormDefaults(), ...caze };
    form.reset(
      {
        ...cazeRawValue,
        id: { value: cazeRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): CazeFormDefaults {
    return {
      id: null,
    };
  }
}
