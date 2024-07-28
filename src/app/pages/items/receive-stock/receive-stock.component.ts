import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ConfirmDialogComponent } from '@common/components/confirm-dialog/confirm-dialog.component';
import { ReceiveStockFormComponent } from '../receive-stock-form/receive-stock-form.component';
import { ToastWrapperModule } from '@common/shared/toast.module';
import { ConfirmDialogWrapperModule } from '@common/shared/confirm-dialog.module';
import { MenuItem, MessageService } from 'primeng/api';
import { Item } from '@common/interfaces/items.interface';
import { InventoryService } from '@common/services/inventory/inventory.service';
import { ReceiveBulkStockFormComponent } from '../receive-bulk-stock-form/receive-bulk-stock-form.component';

@Component({
  selector: 'app-receive-stock',
  standalone: true,
  imports: [
    CommonModule,
    ConfirmDialogComponent,
    ReceiveStockFormComponent,
    ReceiveBulkStockFormComponent,
    ToastWrapperModule,
    ConfirmDialogWrapperModule
  ],
  templateUrl: './receive-stock.component.html',
  styleUrl: './receive-stock.component.scss'
})
export class ReceiveStockComponent implements OnChanges {
  private inventoryService = inject(InventoryService);
  private messageService = inject(MessageService);

  actionInvoices!: MenuItem[];
  nextLotNo!: number;
  showStockReceivingDialog: boolean = false;

  @Input() selectedItemId!: string;
  @Input() selectedItem!: Item | null;
  @Input() mode: 'single' | 'bulk' = 'single';

  @Output() closeEvent = new EventEmitter<any>();

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['selectedItemId'] && !changes['selectedItemId'].firstChange && changes['selectedItemId'].currentValue) {
      this.receiveStockAction();
    }
  }

  receiveStockAction() {
    this.inventoryService.largestLotNo$(this.selectedItemId).subscribe(largestLotNo => {
        this.nextLotNo = largestLotNo + 1;
        this.showStockReceivingDialog = true;
    })
  }

  onHideUpdateDialog(flag: boolean) {
    this.showStockReceivingDialog = flag;
    
    this.resetInputParams();
    this.closeEvent.emit(true);
  }

  onStockReceiveSubmit(formData: any) {
    console.log(formData);
    if (this.selectedItem && this.selectedItem._id) {
      this.receiveStock({...formData});
    }
  }

  receiveStock(data: any) {
    this.inventoryService.receiveInventory$(data).subscribe({
      next: (response) => {
        this.showStockReceivingDialog = false;
        

        this.selectedItem = null;
        console.log('Update successful', response);
        
        this.resetInputParams();
        this.closeEvent.emit(true);
        this.showMessage('Stock Received', 'Inventory is updated successfully.', 'success');
        // this.page$.next(1);
        // window.scrollTo(0, 0); 
      },
      error: (error) => {  
        console.error('Update failed', error);
        this.handleError(error);
      }
    });
  }

  onStockReceiveCancel(event: any) {
    console.log('onStockReceiveCancel', event);
    if (event) {
      this.showStockReceivingDialog = false;
      this.resetInputParams();
      this.closeEvent.emit(true);
    }
  }

  resetInputParams() {
    this.selectedItemId = '';
    this.selectedItem = null;
    this.nextLotNo = 0;
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
}
