import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IPlateau, NewPlateau } from '../plateau.model';

export type PartialUpdatePlateau = Partial<IPlateau> & Pick<IPlateau, 'id'>;

export type EntityResponseType = HttpResponse<IPlateau>;
export type EntityArrayResponseType = HttpResponse<IPlateau[]>;

@Injectable({ providedIn: 'root' })
export class PlateauService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/plateaus');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(plateau: NewPlateau): Observable<EntityResponseType> {
    return this.http.post<IPlateau>(this.resourceUrl, plateau, { observe: 'response' });
  }

  update(plateau: IPlateau): Observable<EntityResponseType> {
    return this.http.put<IPlateau>(`${this.resourceUrl}/${this.getPlateauIdentifier(plateau)}`, plateau, { observe: 'response' });
  }

  partialUpdate(plateau: PartialUpdatePlateau): Observable<EntityResponseType> {
    return this.http.patch<IPlateau>(`${this.resourceUrl}/${this.getPlateauIdentifier(plateau)}`, plateau, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IPlateau>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IPlateau[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getPlateauIdentifier(plateau: Pick<IPlateau, 'id'>): number {
    return plateau.id;
  }

  comparePlateau(o1: Pick<IPlateau, 'id'> | null, o2: Pick<IPlateau, 'id'> | null): boolean {
    return o1 && o2 ? this.getPlateauIdentifier(o1) === this.getPlateauIdentifier(o2) : o1 === o2;
  }

  addPlateauToCollectionIfMissing<Type extends Pick<IPlateau, 'id'>>(
    plateauCollection: Type[],
    ...plateausToCheck: (Type | null | undefined)[]
  ): Type[] {
    const plateaus: Type[] = plateausToCheck.filter(isPresent);
    if (plateaus.length > 0) {
      const plateauCollectionIdentifiers = plateauCollection.map(plateauItem => this.getPlateauIdentifier(plateauItem)!);
      const plateausToAdd = plateaus.filter(plateauItem => {
        const plateauIdentifier = this.getPlateauIdentifier(plateauItem);
        if (plateauCollectionIdentifiers.includes(plateauIdentifier)) {
          return false;
        }
        plateauCollectionIdentifiers.push(plateauIdentifier);
        return true;
      });
      return [...plateausToAdd, ...plateauCollection];
    }
    return plateauCollection;
  }
}
