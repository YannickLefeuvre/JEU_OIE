import { Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { IJoueur, NewJoueur } from '../joueur.model';

/**
 * A partial Type with required key is used as form input.
 */
type PartialWithRequiredKeyOf<T extends { id: unknown }> = Partial<Omit<T, 'id'>> & { id: T['id'] };

/**
 * Type for createFormGroup and resetForm argument.
 * It accepts IJoueur for edit and NewJoueurFormGroupInput for create.
 */
type JoueurFormGroupInput = IJoueur | PartialWithRequiredKeyOf<NewJoueur>;

type JoueurFormDefaults = Pick<NewJoueur, 'id'>;

type JoueurFormGroupContent = {
  id: FormControl<IJoueur['id'] | NewJoueur['id']>;
  nom: FormControl<IJoueur['nom']>;
  positions: FormControl<IJoueur['positions']>;
  couleur: FormControl<IJoueur['couleur']>;
  user: FormControl<IJoueur['user']>;
  caze: FormControl<IJoueur['caze']>;
  plateau: FormControl<IJoueur['plateau']>;
};

export type JoueurFormGroup = FormGroup<JoueurFormGroupContent>;

@Injectable({ providedIn: 'root' })
export class JoueurFormService {
  createJoueurFormGroup(joueur: JoueurFormGroupInput = { id: null }): JoueurFormGroup {
    const joueurRawValue = {
      ...this.getFormDefaults(),
      ...joueur,
    };
    return new FormGroup<JoueurFormGroupContent>({
      id: new FormControl(
        { value: joueurRawValue.id, disabled: true },
        {
          nonNullable: true,
          validators: [Validators.required],
        }
      ),
      nom: new FormControl(joueurRawValue.nom),
      positions: new FormControl(joueurRawValue.positions),
      couleur: new FormControl(joueurRawValue.couleur),
      user: new FormControl(joueurRawValue.user),
      caze: new FormControl(joueurRawValue.caze),
      plateau: new FormControl(joueurRawValue.plateau),
    });
  }

  getJoueur(form: JoueurFormGroup): IJoueur | NewJoueur {
    return form.getRawValue() as IJoueur | NewJoueur;
  }

  resetForm(form: JoueurFormGroup, joueur: JoueurFormGroupInput): void {
    const joueurRawValue = { ...this.getFormDefaults(), ...joueur };
    form.reset(
      {
        ...joueurRawValue,
        id: { value: joueurRawValue.id, disabled: true },
      } as any /* cast to workaround https://github.com/angular/angular/issues/46458 */
    );
  }

  private getFormDefaults(): JoueurFormDefaults {
    return {
      id: null,
    };
  }
}
