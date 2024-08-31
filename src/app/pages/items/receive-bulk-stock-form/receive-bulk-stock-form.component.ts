import { CommonModule } from '@angular/common';
import { Component, CreateEffectOptions, effect, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CurrencyService } from '@common/services/currency/currency.service';
import { DataSharingService } from '@common/services/data-sharing/data-sharing.service';
import { InventoryService } from '@common/services/inventory/inventory.service';

@Component({
  selector: 'app-receive-bulk-stock-form',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule
  ],
  templateUrl: './receive-bulk-stock-form.component.html',
  styleUrl: './receive-bulk-stock-form.component.scss'
})
export class ReceiveBulkStockFormComponent {
  private dataSharingService = inject(DataSharingService);
  private currencyService = inject(CurrencyService);
  userSettings!: any;
  private inventoryService = inject(InventoryService);
  private fb: FormBuilder = inject(FormBuilder);
  @Input() data!: any;
  @Input() itemId!: any;
  @Input() selectedItem!: any;
  @Input() nextLotNo!: number | null;
  @Output() submitEvent = new EventEmitter<any>();
  @Output() cancelEvent = new EventEmitter<any>();

  receiveBulkStockForm!: FormGroup;
  minDate: Date = new Date();

  constructor() {
    const options: CreateEffectOptions = {
      allowSignalWrites: true
    };
    // Use effect to react to signal changes
    effect(() => {
      this.userSettings = this.dataSharingService.userSettings();
    }, options);
  }

  ngOnInit() {
    this.receiveBulkStockForm = this.fb.group({
      stocks: this.fb.array([this.createStockFormGroup()]) // Initialize with one form group
    });
  }

  createStockFormGroup(): FormGroup {
    return this.fb.group({
      item: ['', [Validators.required, Validators.pattern(/^[a-fA-F0-9]{24}$/)]],
      lotNo: [{value: 1, disabled: true}, [Validators.required, Validators.min(1)]],
      purchasePrice: [0.01, [Validators.required, Validators.min(0.01)]],
      totalStock: [0, [Validators.required, Validators.min(1)]],
      stockReceivedDate: [new Date(), [Validators.required]],
      description: ['']
    });
  }

  get stocks(): FormArray {
    return this.receiveBulkStockForm.get('stocks') as FormArray;
  }

  addStock() {
    this.stocks.push(this.createStockFormGroup());
  }

  removeStock(index: number) {
    this.stocks.removeAt(index);
  }

  onSubmit() {
    
  }
}
