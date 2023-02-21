import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IReponse, NewReponse } from '../reponse.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IReponse for edit and NewReponseFormGroupInput for create.
 */
type ReponseFormGroupInput = IReponse | PartialWithRequiredKeyOf<NewReponse>;

type ReponseFormDefaults = Pick<NewReponse, 'id'>;

type ReponseFormGroupContent = {
  id: FormControl<IReponse['id'] | NewReponse['id']>;
  question: FormControl<IReponse['question']>;
  reponse: FormControl<IReponse['reponse']>;
  user: FormControl<IReponse['user']>;
};

export type ReponseFormGroup = FormGroup<ReponseFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class ReponseFormService {
  createReponseFormGroup(reponse: ReponseFormGroupInput = { id: null }): ReponseFormGroup {
    const reponseRawValue = {
      ...this.getFormDefaults(),
      ...reponse,
    };
    return new FormGroup<ReponseFormGroupContent>({
      id: new FormControl(
        { value: reponseRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      question: new FormControl(reponseRawValue.question),
      reponse: new FormControl(reponseRawValue.reponse),
      user: new FormControl(reponseRawValue.user),
    });
  }

  getReponse(form: ReponseFormGroup): IReponse | NewReponse {
    return form.getRawValue() as IReponse | NewReponse;
  }

  resetForm(form: ReponseFormGroup, reponse: ReponseFormGroupInput): void {
    const reponseRawValue = { ...this.getFormDefaults(), ...reponse };
    form.reset(
      {
        ...reponseRawValue,
        id: { value: reponseRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): ReponseFormDefaults {
    return {
      id: null,
    };
  }
}
