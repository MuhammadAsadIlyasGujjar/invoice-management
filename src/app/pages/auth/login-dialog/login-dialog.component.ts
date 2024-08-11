import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { LoginComponent } from '../login/login.component';
import { DialogModule } from 'primeng/dialog';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-login-dialog',
  standalone: true,
  imports: [
    CommonModule,
    LoginComponent,
    DialogModule,
    ButtonModule,
  ],
  templateUrl: './login-dialog.component.html',
  styleUrl: './login-dialog.component.scss'
})
export class LoginDialogComponent {
  @Input() openLoginDialog: boolean = false;
  // Create an EventEmitter instance and decorate it with @Output
  @Output() loggedInEvent = new EventEmitter<string>();

  showDialog() {
    this.openLoginDialog = true;
  }

  closeDialog() {
    this.openLoginDialog = false;
  }

  logInSuccessEvent() {
    this.closeDialog();
    this.loggedInEvent.emit();
  }

}
