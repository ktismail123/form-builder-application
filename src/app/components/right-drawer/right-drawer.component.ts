import { Component, inject, OnInit } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FieldGroupService } from '../../service/field-group.service';
import { NgFor, NgIf } from '@angular/common';
import { from } from 'rxjs';

@Component({
  selector: 'app-right-drawer',
  templateUrl: './right-drawer.component.html',
  styleUrl: './right-drawer.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
})
export class RightDrawerComponent implements OnInit {
  private fb = inject(FormBuilder);
  private fgService = inject(FieldGroupService);

  fieldForm!: FormGroup;
  isAction = false;
  inputType!: string;
  selectedElement: any;

  ngOnInit(): void {
    this.initForm();

    this.fgService.clickedForEdit$.subscribe((res) => {
      this.inputType = res?.data?.inputType;
      this.selectedElement = res?.data;

      this.isAction = ['select', 'multi-select', 'radio', 'checkbox'].includes(
        this.inputType
      );
      this.setFormData(res.data);
    });
  }

  initForm(): void {
    this.fieldForm = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      placeholder: [''],
      required: [false],
      defaultValue: [''],
      options: this.fb.array([]),
      min: [''],
      max: [''],
    });
  }

  setFormData(data: any): void {
    this.fieldForm.patchValue({
      name: data.label || '',
      description: data.description || '',
      placeholder: data.placeholder || '',
      required: data.required || false,
      defaultValue: data.defaultValue || '',
      min: data.min || '',
      max: data.max || '',
    });

    const optionsArray = this.options;
    optionsArray.clear();

    if (Array.isArray(data.options)) {
      data.options.forEach((opt: any) => {
        optionsArray.push(
          this.fb.group({
            label: [opt.label || '', Validators.required],
            value: [opt.value || '', Validators.required],
          })
        );
      });
    }
  }

  get options(): FormArray {
    return this.fieldForm.get('options') as FormArray;
  }

  addOption(): void {
    this.options.push(
      this.fb.group({
        label: ['', Validators.required],
        value: ['', Validators.required],
      })
    );
  }

  removeOption(index: number): void {
    this.options.removeAt(index);
  }

  onSubmit(): void {
    if (this.fieldForm.invalid) return;
  
    const formValue = this.fieldForm.value;
    const raw = localStorage.getItem('fieldGroups');
    const selectedGroupId = localStorage.getItem('selectedId'); // ID of the group
    const selectedElementId = this.selectedElement?.id; // ID of the element inside elements array
  
    if (!raw || !selectedGroupId || !selectedElementId) return;
  
    const data = JSON.parse(raw);
  
    // Find the group
    const groupIndex = data.findIndex((group: any) => group.id === selectedGroupId);
    if (groupIndex === -1) return;
  
    const group = data[groupIndex];
  
    // Find the element inside the group
    const elementIndex = group.elements.findIndex((el: any) => el.id === selectedElementId);
    if (elementIndex === -1) return;
  
    // Update the element
    const updatedElement = {
      ...group.elements[elementIndex],
      label: formValue.name,
      name: formValue.name,
      description: formValue.description,
      placeholder: formValue.placeholder,
      required: formValue.required,
      defaultValue: formValue.defaultValue,
      min: formValue.min,
      max: formValue.max,
      options: this.isAction ? formValue.options : []
    };
  
    // Replace element in group
    data[groupIndex].elements[elementIndex] = updatedElement;
  
    // Save back to localStorage
    localStorage.setItem('fieldGroups', JSON.stringify(data));
  
    this.fgService.clickedForEdit.set(null);
    this.fgService.storageDataUpdates.set(true);
    alert('Succesfully Updated');

  }
  

  onCancel(): void {
    this.fgService.clickedForEdit.set(null);
  }
}
