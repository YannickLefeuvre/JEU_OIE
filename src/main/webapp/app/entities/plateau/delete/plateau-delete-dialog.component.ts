import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IPlateau } from '../plateau.model';
import { PlateauService } from '../service/plateau.service';
import { ITEM_DELETED_EVENT } from 'app/config/navigation.constants';

@Component({
  templateUrl: './plateau-delete-dialog.component.html',
})
export class PlateauDeleteDialogComponent {
  plateau?: IPlateau;

  constructor(protected plateauService: PlateauService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.plateauService.delete(id).subscribe(() => {
      this.activeModal.close(ITEM_DELETED_EVENT);
    });
  }
}
