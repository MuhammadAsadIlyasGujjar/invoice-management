import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter, inject } from '@angular/core';
import { BackdropService } from '@common/services/signals/backdrop.service';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-page-header',
  standalone: true,
  imports: [CommonModule, TranslateModule],
  templateUrl: './page-header.component.html',
  styleUrl: './page-header.component.scss'
})
export class PageHeaderComponent {
  backDropService = inject(BackdropService);
  @Input() heading!: string;
  @Input() heading2!: string;
  @Input() buttonLabel!: string;
  @Input() showActionButton: boolean = true;

  @Output() searchClick = new EventEmitter<void>();
  @Output() addClick = new EventEmitter<void>();

  onSearchClick() {
    this.searchClick.emit();
  }

  onAddClick() {
    this.addClick.emit();
  }
}
