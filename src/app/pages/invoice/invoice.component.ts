import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component, CreateEffectOptions, effect, inject, OnDestroy, OnInit } from '@angular/core';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { Invoice, InvoicesPaginator } from '@common/interfaces/invoices.interface';
import { InvoicesService } from '@common/services/invoices/invoices.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { BehaviorSubject, debounceTime, Observable, scan, Subject, switchMap, tap } from 'rxjs';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CustomCurrencyPipe } from '@common/pipes/custom-currency.pipe';
import { InputNumberModule } from 'primeng/inputnumber';
import { DataSharingService } from '@common/services/data-sharing/data-sharing.service';
import { CurrencyService } from '@common/services/currency/currency.service';
import { ConfirmDialogWrapperModule } from '@common/shared/confirm-dialog.module';
import { ToastWrapperModule } from '@common/shared/toast.module';
import { TranslateModule } from '@ngx-translate/core';
import { convertToDate, convertToStartAndEndOfDayInUTC, isValidDate } from '@common/funtions/convert-date';
import { FilterService } from '@common/services/filter/filter.service';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [
    CommonModule,
    HttpClientModule,
    InfiniteScrollModule,
    MenuModule,
    CalendarModule,
    DropdownModule,
    FormsModule,
    PageHeaderComponent,
    CustomCurrencyPipe,
    InputNumberModule,
    ConfirmDialogWrapperModule,
    ToastWrapperModule,
    TranslateModule
  ],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit, OnDestroy {
  private api = inject(InvoicesService);
  private router = inject(Router);
  private dataSharingService = inject(DataSharingService);
  private currencyService = inject(CurrencyService);
  private confirmationService: ConfirmationService = inject(ConfirmationService);
  private messageService: MessageService = inject(MessageService);
  private filterService: FilterService = inject(FilterService);

  userSettings!: any;

  public paginator$!: Observable<InvoicesPaginator>;
  private searchSubject = new Subject<string | null>();

  public loading$ = new BehaviorSubject(true);
  private page$ = new BehaviorSubject(1);

  actionInvoices!: MenuItem[];

  showUpdateDialog: boolean = false;
  selectedInvoice: any;

  sortOptions!: MenuItem[];
  private params: any = {};

  options = [
    {label: 'Customer', value: 'customer'},
    // {label: 'Invoice No', value: '_id'},
    {label: 'Issued Date', value: 'date'},
    {label: 'Due Date', value: 'dueDate'},
    {label: 'Amount', value: 'amountDue'}
    // Add more options as needed
  ];

  selectedOption: any = {label: 'Customer', value: 'customer'}; // Initially no option is selected

  searchValue: any;

  constructor() {
    this.paginator$ = this.loadInvoices$();

    this.params['searchField'] = this.selectedOption.value;

    this.params['sortBy'] = 'invoiceNumber';
    this.params['sortOrder'] = 'desc';

    const options: CreateEffectOptions = {
      allowSignalWrites: true
    };
    // Use effect to react to signal changes
    effect(() => {
      this.userSettings = this.dataSharingService.userSettings();
    }, options);
  }

  ngOnInit() {
    this.sortOptions = [
      { label: 'Customer Name: A to Z', icon: 'pi pi-sort-alpha-down', command: () => this.sort('customerNameAsc') },
      { label: 'Customer Name: Z to A', icon: 'pi pi-sort-alpha-up', command: () => this.sort('customerNameDesc') },
      { label: 'Invoice: Old to New', icon: 'pi pi-sort-numeric-down', command: () => this.sort('InvoiceNoAsc') },
      { label: 'Invoice: New to Old', icon: 'pi pi-sort-numeric-up', command: () => this.sort('InvoiceNoDesc') },
      { label: 'Issued Date: Old to New', icon: 'pi pi-sort-amount-down', command: () => this.sort('issuedDateAsc') },
      { label: 'Issued Date: New to Old', icon: 'pi pi-sort-amount-up', command: () => this.sort('issuedDateDesc') },
      { label: 'Due Date: Old to New', icon: 'pi pi-sort-amount-down', command: () => this.sort('dueDateAsc') },
      { label: 'Due Date: New to Old', icon: 'pi pi-sort-amount-up', command: () => this.sort('dueDateDesc') },
      { label: 'Amount: Low to High', icon: 'pi pi-sort-amount-down', command: () => this.sort('amountAsc') },
      { label: 'Amount: High to Low', icon: 'pi pi-sort-amount-up', command: () => this.sort('amountDesc') }
    ];

    this.searchSubject.pipe(
      debounceTime(700)  // Wait for 300ms pause in events
    ).subscribe(searchText => {
      console.log('Search query:', searchText);
      this.params['search'] = searchText;

      console.log('searchParams', this.params);
      this.page$.next(1);
      window.scrollTo(0, 0); 
    });


     // Get the stored filter state if it exists
     const savedFilter = this.filterService.getFilterState();
     if (savedFilter) {
       this.params = savedFilter;

       
       const selectedOption = this.options.find((option: any) => option.value === savedFilter?.['searchField']);
       if (selectedOption && savedFilter['searchField']) {
         this.selectedOption = selectedOption;
         const searchValue = savedFilter?.['search'] ?? undefined;

         if (this.selectedOption?.value === 'date' || this.selectedOption?.value === 'dueDate') {

          if (isValidDate(searchValue)) {
            this.searchValue = new Date(searchValue);  // Emit the trimmed value
          }

         } else {
          this.searchValue = searchValue;
         }
       }
        // this.params['searchField'] = this.selectedOption.value;
     } else {
       this.resetFilters();
     }
  }

  // Method to reset the filters (e.g., when no saved filter is found)
  resetFilters() {
    this.params = {};
  }

  // Save the filter when navigating away from /items
  onNavigate() {
    this.filterService.setFilterState(this.params);
  }

  onSearch(event: KeyboardEvent | null = null): void {
    if (this.selectedOption.value === 'amountDue' && !this.searchValue) {
      this.searchValue = '';
    }
    if (event && this.selectedOption.value === 'customer') {
      const inputElement = event.target as HTMLInputElement;
      this.searchSubject.next(inputElement.value.trim());  // Emit the trimmed value
    } else if (event && this.selectedOption.value === 'amountDue') {
      this.searchSubject.next(this.searchValue);  // Emit the trimmed value
    } else {
      console.log(convertToStartAndEndOfDayInUTC(this.searchValue))

      if (isValidDate(this.searchValue)) {

        this.searchSubject.next(convertToDate(this.searchValue));  // Emit the trimmed value
      } else if(!this.searchValue) {
        this.searchSubject.next('');
      }
    }
  }

  sort(criteria: string) {
    // Implement your sorting logic here based on the criteria
    console.log(`Sorting by ${criteria}`);
  }

  private loadInvoices$(): Observable<InvoicesPaginator> {
    return this.page$.pipe(
      tap(() => this.loading$.next(true)),
      switchMap((page) => this.api.getInvoices$(this.params, page)),
      scan(this.updatePaginator, {invoices: [], page: 0, hasMorePages: true, total: 0} as InvoicesPaginator),
      tap(() => this.loading$.next(false)),
    );
  }

  private updatePaginator(accumulator: InvoicesPaginator, value: InvoicesPaginator): InvoicesPaginator {
    if (value.page === 1) {
      return value;
    }

    accumulator.invoices.push(...value.invoices);
    accumulator.page = value.page;
    accumulator.hasMorePages = value.hasMorePages;

    return accumulator;
  }

  public loadMoreInvoices(paginator: InvoicesPaginator) {
    if (!paginator.hasMorePages) {
      return;
    }
    this.page$.next(paginator.page + 1);
  }

  generateMenuInvoices(event: MouseEvent, invoice: any, index: number) {
    event.preventDefault();
    event.stopPropagation();

    this.actionInvoices = [
      {
          label: 'Update',
          icon: 'pi pi-refresh',
          command: () => this.updateAction(event, invoice, index)
      },
      {
          label: 'Sale Return',
          icon: 'pi pi-arrow-left',
          command: () => this.saleReturnAction(event, invoice, index)
      }
    ]
  }

  updateAction(event: MouseEvent, invoice: any, index: number) {
    event.stopPropagation();
    event.preventDefault();


    this.showUpdateDialog = true;
    // Your update logic here
    console.log('Update action triggered'+index, invoice);
    this.selectedInvoice = invoice;
    this.navigateToEditInvoice(invoice._id);
  }

  saleReturnAction(event: MouseEvent, invoice: Invoice, index: number) {
    event.stopPropagation();
    event.preventDefault();

    this.confirmationService.confirm({
      message: 'Are you sure you want to revert the sale?',
      header: 'Sale Return Confirmation',
      icon: 'pi pi-info-circle',
      accept: () => {
        this.api.saleReturnInvoice$(invoice).subscribe({
          next: (response) => {
            this.showMessage('Sale Return Successful', 'The stock is reverted and deleted the invoice.', 'success');
            invoice.deleted = true;
          },
          error: (error) => {
            console.error('Update failed', error);
            this.handleError(error);
          }
        })
        // Your delete logic here
        console.log('Delete action triggered'+index, invoice);
        // invoice.deleted = true;
      },
      reject: () => {
          console.log('Rejected');
      },
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      rejectButtonStyleClass: 'mr-4 mt-3 inline-flex w-full justify-center rounded-md text-white px-3 py-2 text-sm font-semibold bg-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 hover:text-gray-900 sm:mt-0 sm:w-auto',
      acceptButtonStyleClass: 'mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-800 hover:text-gray-50 sm:mt-0 sm:w-auto'
    });
  }

  showMessage(summary:string, detail: string, severity: string = 'error') {
    this.messageService.add({
      severity: severity,
      summary: summary,
      detail: detail
    });
  }

  handleError(errorResp: any) {
    if (errorResp?.error?.message) {
      const { error, message } = errorResp?.error?.message;
      if (error && message) {
        this.showMessage(error, message);
      }
    }
  }

  onAddInvoice(event: any) {
    this.showUpdateDialog = true;
    this.selectedInvoice = null;
  }

  onSearchClick() {}

  onFilterChange(event: any) {
    this.searchValue = undefined;
    this.params['searchField'] = this.selectedOption.value;
  }

  onAddItem(event: any) {
    this.router.navigate(['invoice/create'])
  }

  navigateToInvoice(invoiceId: string | number): void {
    // Navigate to the invoice detail route with the given id
    this.router.navigate(['/invoice', invoiceId]);
  }

  navigateToEditInvoice(id: string): void {
    this.router.navigate([`/invoice/${id}/edit`]);
  }

  get currencySymbol() {
    if (this.userSettings?.currency) {
      return this.currencyService.getCurrencySymbol(this.userSettings.currency)
    }
    return '€';
  }

  ngOnDestroy(): void {
    this.onNavigate();
  }

}
