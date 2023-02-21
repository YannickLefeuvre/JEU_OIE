import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ICaze, NewCaze } from '../caze.model';

export type PartialUpdateCaze = Partial<ICaze> & Pick<ICaze, 'id'>;

export type EntityResponseType = HttpResponse<ICaze>;
export type EntityArrayResponseType = HttpResponse<ICaze[]>;

@Injectable({ providedIn: 'root' })
export class CazeService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/cazes');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(caze: NewCaze): Observable<EntityResponseType> {
    return this.http.post<ICaze>(this.resourceUrl, caze, { observe: 'response' });
  }

  update(caze: ICaze): Observable<EntityResponseType> {
    return this.http.put<ICaze>(`${this.resourceUrl}/${this.getCazeIdentifier(caze)}`, caze, { observe: 'response' });
  }

  partialUpdate(caze: PartialUpdateCaze): Observable<EntityResponseType> {
    return this.http.patch<ICaze>(`${this.resourceUrl}/${this.getCazeIdentifier(caze)}`, caze, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ICaze>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ICaze[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getCazeIdentifier(caze: Pick<ICaze, 'id'>): number {
    return caze.id;
  }

  compareCaze(o1: Pick<ICaze, 'id'> | null, o2: Pick<ICaze, 'id'> | null): boolean {
    return o1 && o2 ? this.getCazeIdentifier(o1) === this.getCazeIdentifier(o2) : o1 === o2;
  }

  addCazeToCollectionIfMissing<Type extends Pick<ICaze, 'id'>>(
    cazeCollection: Type[],
    ...cazesToCheck: (Type | null | undefined)[]
  ): Type[] {
    const cazes: Type[] = cazesToCheck.filter(isPresent);
    if (cazes.length > 0) {
      const cazeCollectionIdentifiers = cazeCollection.map(cazeItem => this.getCazeIdentifier(cazeItem)!);
      const cazesToAdd = cazes.filter(cazeItem => {
        const cazeIdentifier = this.getCazeIdentifier(cazeItem);
        if (cazeCollectionIdentifiers.includes(cazeIdentifier)) {
          return false;
        }
        cazeCollectionIdentifiers.push(cazeIdentifier);
        return true;
      });
      return [...cazesToAdd, ...cazeCollection];
    }
    return cazeCollection;
  }
}
