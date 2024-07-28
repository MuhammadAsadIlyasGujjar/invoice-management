import { Injectable, Signal, WritableSignal, inject, signal } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, map, of, tap } from 'rxjs';
import { CustomerJsonResponse, CustomersPaginator } from '@common/interfaces/customers.interface';

@Injectable({
  providedIn: 'root'
})
export class CustomersService extends BaseService {
  private http = inject(HttpClient);
  private customersSignal: WritableSignal<any[]> = signal<any[]>([]);  // Initialize the signal with an empty array

  constructor() {
    super();
  }


  public getCustomers$(params: any, page: number = 1, customersPerPage: number = 16): Observable<CustomersPaginator> {
    return this.http.get<CustomerJsonResponse>(
      '/customers',
      {
        params: {
          limit: customersPerPage,
          skip: customersPerPage * (page - 1),
          ...params
        }
      }
    ).pipe(
      map((response) => ({
        customers: response.customers,
        page: page,
        hasMorePages: response.skip + response.limit < response.total,
        total: response.total
      } as CustomersPaginator))
    );
  }

  public createCustomer$(updateData: any): Observable<any> {
    return this.http.post(`/customers`, updateData)
      .pipe(
        tap(() => { this.fetchCustomers() }),
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public updateCustomer$(customerId: string, updateData: any): Observable<any> {
    return this.http.put(`/customers/${customerId}`, updateData)
      .pipe(
        tap(() => { this.fetchCustomers() }),
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public deleteCustomer$(customerId: string): Observable<any> {
    return this.http.delete(`/customers/${customerId}`)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public getCustomersList$(): Observable<any> {
    return this.http.get(`/customers/list`)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  fetchCustomers(): void {
    this.getCustomersList$()  // Adjust the API endpoint as needed
      .pipe(
        tap(customers => {
          this.customersSignal.set(customers);
        }),  // Update the signal with fetched customers
        catchError(this.handleError<any[]>('fetchCustomers', []))
      )
      .subscribe();
  }

  getCustomersSignal(): Signal<any[]> {
    return this.customersSignal;
  }

  private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); // Log to console instead
      return of(result as T);
    };
  }
}
