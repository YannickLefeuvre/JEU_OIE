import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IPlateau } from '../plateau.model';
import { PlateauService } from '../service/plateau.service';

@Injectable({ providedIn: 'root' })
export class PlateauRoutingResolveService implements Resolve<IPlateau | null> {
  constructor(protected service: PlateauService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IPlateau | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((plateau: HttpResponse<IPlateau>) => {
          if (plateau.body) {
            return of(plateau.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(null);
  }
}
