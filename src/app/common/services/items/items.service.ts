import { Injectable, Signal, WritableSignal, inject, signal } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { ItemsJsonResponse, ItemsPaginator } from '@common/interfaces/items.interface';

@Injectable({
  providedIn: 'root'
})
export class ItemsService extends BaseService {
  private http = inject(HttpClient);
  private itemsSignal: WritableSignal<any[]> = signal<any[]>([]);  // Initialize the signal with an empty array

  constructor() {
    super();
  }

  public getItems$(params: any, page: number = 1, itemsPerPage: number = 16): Observable<ItemsPaginator> {
    return this.http.get<ItemsJsonResponse>(
      '/items',
      {
        params: {
          limit: itemsPerPage,
          skip: itemsPerPage * (page - 1),
          ...params
        }
      }
    ).pipe(
      map((response) => ({
        items: response.items,
        page: page,
        hasMorePages: response.skip + response.limit < response.total,
        total: response.total
      } as ItemsPaginator))
    );
  }

  public createItem$(updateData: any): Observable<any> {
    return this.http.post(`/items`, updateData)
      .pipe(
        tap(() => { this.fetchItems() }),
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public updateItem$(itemId: string, updateData: any): Observable<any> {
    return this.http.put(`/items/${itemId}`, updateData)
      .pipe(
        tap(() => { this.fetchItems() }),
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public deleteItem$(itemId: string): Observable<any> {
    return this.http.delete(`/items/${itemId}`)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public addItemPrice$(itemId: string, updateData: any): Observable<any> {
    return this.http.post(`/items/${itemId}/prices`, updateData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public getItemsList$(): Observable<any> {
    return this.http.get(`/items/list`)
      .pipe(
        map((response: any) => {
          // Process the response if needed
          return response.data;
        })
      );
  }

  fetchItems(): void {
    this.getItemsList$()  // Adjust the API endpoint as needed
      .pipe(
        tap(items => {
          this.itemsSignal.set(items);
        }),  // Update the signal with fetched items
        catchError(this.handleError<any[]>('fetchItems', []))
      )
      .subscribe();
  }

  getItemsSignal(): Signal<any[]> {
    return this.itemsSignal;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // Log to console instead
      return of(result as T);
    };
  }
  
}
