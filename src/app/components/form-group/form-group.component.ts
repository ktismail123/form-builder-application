import { TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialogClose,
  MatDialogRef,
} from '@angular/material/dialog';

@Component({
  selector: 'app-form-group',
  imports: [FormsModule, MatDialogClose, TitleCasePipe],
  templateUrl: './form-group.component.html',
  styleUrl: './form-group.component.scss',
})
export class FormGroupComponent {
  injectedData: { mode: 'create' | 'edit', name: string, description: string } = inject(MAT_DIALOG_DATA);
  private dialogRef = inject(MatDialogRef<FormGroupComponent>);

  name = this.injectedData?.name || '';
  description = this.injectedData?.description || '';
  submitted = false;

  onSubmit(): void {
    this.submitted = true;

    if (this.name && this.description) {
      const data = {
        name: this.name,
        description: this.description,
      };
      this.dialogRef.close({ success: true, data });
    }
  }
}
