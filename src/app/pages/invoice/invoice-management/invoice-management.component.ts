import { CommonModule } from '@angular/common';
import { Component, CreateEffectOptions, effect, ElementRef, inject, ViewChild } from '@angular/core';
import { ActivatedRoute, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { PageHeaderComponent } from '@common/components/layout/page-header/page-header.component';
import { Invoice, InvoiceItem, LotDetails } from '@common/interfaces/invoices.interface';
import { CustomCurrencyPipe } from '@common/pipes/custom-currency.pipe';
import { DataSharingService } from '@common/services/data-sharing/data-sharing.service';
import { InvoicesService } from '@common/services/invoices/invoices.service';
import { PdfService } from '@common/services/pdf/pdf.service';
import { ToastWrapperModule } from '@common/shared/toast.module';
import { serverUrl } from '@environment';
import { TranslateModule } from '@ngx-translate/core';
import { MessageService } from 'primeng/api';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-invoice-management',
  standalone: true,
  imports: [
    CommonModule,
    PageHeaderComponent,
    RouterLink,
    RouterLinkActive,
    ToastWrapperModule,
    CustomCurrencyPipe,
    TranslateModule
  ],
  templateUrl: './invoice-management.component.html',
  styleUrl: './invoice-management.component.scss'
})
export class InvoiceManagementComponent {
  private route = inject(ActivatedRoute);
  private api = inject(InvoicesService);
  private dataSharingService = inject(DataSharingService);
  private messageService: MessageService = inject(MessageService);
  private router = inject(Router);
  private pdfService: PdfService = inject(PdfService);

  invoiceId: string | null = null;
  private paramsSubscription!: Subscription;
  invoice!: Invoice;
  userSettings: any;

  
  serverBaseUrl: any = serverUrl;

  @ViewChild('invoiceContainer', { static: false }) invoiceElement!: ElementRef;

  constructor() {
    const options: CreateEffectOptions = {
      allowSignalWrites: true
    };
    // Use effect to react to signal changes
    effect(() => {
      this.userSettings = this.dataSharingService.userSettings();
    }, options);
  }

  ngOnInit(): void {
    // React to parameter changes
    this.paramsSubscription = this.route.params.subscribe(params => {
      this.invoiceId = params['id'];
      if (typeof this.invoiceId === 'string') {
        this.getInvoiceById(this.invoiceId);
      }
    });
  }

  getInvoiceById(invoiceObjectId: string) {
    this.api.getInvoice$(invoiceObjectId).subscribe({
      next: (response) => {
        this.invoice = response;

        this.invoice.subTotal = this.calculateSubtotal(this.invoice.items);
      },
      error: (error) => {
        if (error?.status === 404) {
          this.router.navigate(['not-found']);
        } else {
          console.error('Update failed', error);
          this.handleError(error);
        }
      }
    })
  }

  calculateSubtotal(items: InvoiceItem[]): number {
    return items.reduce((subtotal, item) => {
      return subtotal + (item.price * item.quantity);
    }, 0);
  }

  getCommaSeparatedLotNo(lots: LotDetails[] | undefined): string {
    if (lots?.length) {
      return lots.map(lot => lot.lotNo === -1 ? '_' : lot.lotNo).join(', ');
    }
    return '';
  }

  showError(summary:string, detail: string) {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: detail
    });
  }

  handleError(errorResp: any) {
    if (errorResp?.error?.message) {
      const { error, message } = errorResp?.error?.message;
      if (error && message) {
        this.showError(error, message);
      }
    }
  }

  ngOnDestroy(): void {
    if (this.paramsSubscription) {
      this.paramsSubscription.unsubscribe();
    }
  }

  get pendingPayment() {
    let pendingPayment = this.invoice?.pendingPayment || 0;
    return Number(pendingPayment);
  }

  get totalAmountDue() {
    return (Number(this.invoice?.amountDue || 0) + this.pendingPayment)?.toFixed(2);
  }

  get currencyCode() {
    return this.userSettings?.currency ?? 'EUR'; //€
  }

  completeUrl(imageUrl: string) {
    return !imageUrl ? '' : (imageUrl.indexOf('http') !== -1 ? '' : this.serverBaseUrl) + imageUrl;
  }

  printInvoice() {
    window.print();
  }

  onAddItem(event: any) {
    this.router.navigate(['invoice/create'])
  }

  navigateToEditInvoice(id: string): void {
    if (id) {
      this.router.navigate([`/invoice/${id}/edit`]);
    }
  }

  async sendResultEmail() {
    try {
      const pdfBlob = await this.pdfService.generatePdf(this.invoiceElement.nativeElement);
      // await this.pdfService.sendPdf(pdfBlob);
      console.log('Email sent successfully');
    } catch (error) {
      console.error('Error sending email', error);
    }
  }

  async downloadInvoice() {
    try {
      const pdfBlob = await this.pdfService.generatePdf(this.invoiceElement.nativeElement);
      this.pdfService.downloadBlob(pdfBlob, `invoice_${this.invoice.invoiceNumber}.pdf`);
      console.log('Downloaded successfully');
    } catch (error) {
      console.error('Error sending email', error);
    }
  }
}
