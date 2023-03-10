import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IJoueur, NewJoueur } from '../joueur.model';

export type PartialUpdateJoueur = Partial<IJoueur> & Pick<IJoueur, 'id'>;

export type EntityResponseType = HttpResponse<IJoueur>;
export type EntityArrayResponseType = HttpResponse<IJoueur[]>;

@Injectable({ providedIn: 'root' })
export class JoueurService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/joueurs');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(joueur: NewJoueur): Observable<EntityResponseType> {
    return this.http.post<IJoueur>(this.resourceUrl, joueur, { observe: 'response' });
  }

  update(joueur: IJoueur): Observable<EntityResponseType> {
    return this.http.put<IJoueur>(`${this.resourceUrl}/${this.getJoueurIdentifier(joueur)}`, joueur, { observe: 'response' });
  }

  partialUpdate(joueur: PartialUpdateJoueur): Observable<EntityResponseType> {
    return this.http.patch<IJoueur>(`${this.resourceUrl}/${this.getJoueurIdentifier(joueur)}`, joueur, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IJoueur>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IJoueur[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  getJoueurIdentifier(joueur: Pick<IJoueur, 'id'>): number {
    return joueur.id;
  }

  compareJoueur(o1: Pick<IJoueur, 'id'> | null, o2: Pick<IJoueur, 'id'> | null): boolean {
    return o1 && o2 ? this.getJoueurIdentifier(o1) === this.getJoueurIdentifier(o2) : o1 === o2;
  }

  addJoueurToCollectionIfMissing<Type extends Pick<IJoueur, 'id'>>(
    joueurCollection: Type[],
    ...joueursToCheck: (Type | null | undefined)[]
  ): Type[] {
    const joueurs: Type[] = joueursToCheck.filter(isPresent);
    if (joueurs.length > 0) {
      const joueurCollectionIdentifiers = joueurCollection.map(joueurItem => this.getJoueurIdentifier(joueurItem)!);
      const joueursToAdd = joueurs.filter(joueurItem => {
        const joueurIdentifier = this.getJoueurIdentifier(joueurItem);
        if (joueurCollectionIdentifiers.includes(joueurIdentifier)) {
          return false;
        }
        joueurCollectionIdentifiers.push(joueurIdentifier);
        return true;
      });
      return [...joueursToAdd, ...joueurCollection];
    }
    return joueurCollection;
  }
}
