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
  standalone: true,
  imports: [FormsModule, TitleCasePipe, MatDialogClose],
  templateUrl: './form-group.component.html',
  styleUrls: ['./form-group.component.scss'],
})
export class FormGroupComponent {
  private dialogRef = inject(MatDialogRef<FormGroupComponent>);
  private data = inject<{ mode: 'create' | 'edit'; name: string; description: string }>(MAT_DIALOG_DATA);

  name: string = this.data?.name || '';
  description: string = this.data?.description || '';
  submitted = false;
  injectedData = this.data;

  onSubmit(): void {
    this.submitted = true;

    if (!this.name || !this.description) return;

    const formData = {
      name: this.name.trim(),
      description: this.description.trim(),
    };

    this.dialogRef.close({ success: true, data: formData });
  }
}
