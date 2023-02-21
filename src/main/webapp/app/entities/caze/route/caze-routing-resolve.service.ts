import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ICaze } from '../caze.model';
import { CazeService } from '../service/caze.service';

@Injectable({ providedIn: 'root' })
export class CazeRoutingResolveService implements Resolve<ICaze | null> {
  constructor(protected service: CazeService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ICaze | null | never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((caze: HttpResponse<ICaze>) => {
          if (caze.body) {
            return of(caze.body);
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
