import { Injectable, inject } from '@angular/core';
import { BaseService } from '../base/base.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Invoice, InvoicesJsonResponse, InvoicesPaginator } from '@common/interfaces/invoices.interface';

@Injectable({
  providedIn: 'root'
})
export class InvoicesService  extends BaseService {
  private http = inject(HttpClient);

  constructor() {
    super();
  }

  public getInvoices$(params: any, page: number = 1, InvoicesPerPage: number = 16): Observable<InvoicesPaginator> {
    return this.http.get<InvoicesJsonResponse>(
      '/invoices',
      {
        params: {
          limit: InvoicesPerPage,
          skip: InvoicesPerPage * (page - 1),
          ...params
        }
      }
    )
    .pipe(
      map((response: any) => {
        return {
          invoices: response.invoices,
          ...response
        }
      })
    )
    .pipe(
      map((response) => ({
        invoices: response.invoices,
        page: page,
        hasMorePages: response.skip + response.limit < response.total,
        total: response.total
      } as InvoicesPaginator))
    );
  }

  public createInvoice$(createData: any): Observable<any> {
    return this.http.post(`/invoices`, createData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public updateInvoice$(invoiceId: string, invoice: Invoice): Observable<any> {
    const {customer, ...inv} = invoice;
    const invoiceData = {customer: customer, ...inv};
    return this.http.put(`/invoices/${invoiceId}`, invoiceData)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public saleReturnInvoice$(invoice: Invoice): Observable<any> {
    
    const {company, customer, ...inv} = invoice;
    const newInvoice = {company: company?._id, customer: customer?._id, ...inv};
    return this.http.put(`/invoices/return/${invoice._id}`, newInvoice)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public getInvoice$(invoiceObjectId: string): Observable<any> {
    return this.http.get(`/invoices/${invoiceObjectId}`)
      .pipe(
        map(response => {
          // Process the response if needed
          return response;
        })
      );
  }

  public getSalesSummary$(startDate: string, endDate: string, granularity: string): Observable<any> {
    const params = new HttpParams()
      .set('startDate', startDate)
      .set('endDate', endDate)
      .set('granularity', granularity);

    return this.http.get<any>(`/invoices/report/sales-summary`, { params });
  }
}
