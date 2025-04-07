import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { FieldGroupService } from '../../service/field-group.service';
import { NgFor, NgIf } from '@angular/common';
import { FieldElement, FieldGroupRight } from '../../models/field-group.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-right-drawer',
  templateUrl: './right-drawer.component.html',
  styleUrl: './right-drawer.component.scss',
  standalone: true,
  imports: [ReactiveFormsModule, NgFor, NgIf],
})
export class RightDrawerComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private fgService = inject(FieldGroupService);

  fieldForm!: FormGroup;
  isAction = false;
  inputType!: string;
  selectedElement: FieldElement | null = null;
  private subscription = new Subscription();

  ngOnInit(): void {
    this.initForm();

    const sub = this.fgService.clickedForEdit$.subscribe((res) => {
      const data = res?.data;
      if (!data) return;

      this.inputType = data.inputType;
      this.selectedElement = data;

      this.isAction = ['select', 'multi-select', 'radio', 'checkbox'].includes(this.inputType);
      this.setFormData(data);
    });

    this.subscription.add(sub);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
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

  setFormData(data: FieldElement): void {
    this.fieldForm.patchValue({
      name: data.label || '',
      description: data.description || '',
      placeholder: data.placeholder || '',
      required: data.required || false,
      defaultValue: data.defaultValue || '',
      min: data.min || '',
      max: data.max || '',
    });

    this.options.clear();

    if (Array.isArray(data.options)) {
      data.options.forEach(opt => {
        this.options.push(
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
    const selectedGroupId = localStorage.getItem('selectedId');
    const selectedElementId = this.selectedElement?.id;

    if (!selectedGroupId || !selectedElementId) return;

    let groups: FieldGroupRight[] = [];

    try {
      const raw = localStorage.getItem('fieldGroups');
      groups = raw ? JSON.parse(raw) : [];
    } catch (err) {
      console.error('Error parsing fieldGroups from localStorage:', err);
      return;
    }

    const groupIndex = groups.findIndex(group => group.id === selectedGroupId);
    if (groupIndex === -1) return;

    const elementIndex = groups[groupIndex].elements.findIndex(el => el.id === selectedElementId);
    if (elementIndex === -1) return;

    const updatedElement: FieldElement = {
      ...groups[groupIndex].elements[elementIndex],
      label: formValue.name,
      description: formValue.description,
      placeholder: formValue.placeholder,
      required: formValue.required,
      defaultValue: formValue.defaultValue,
      min: formValue.min,
      max: formValue.max,
      options: this.isAction ? formValue.options : []
    };

    groups[groupIndex].elements[elementIndex] = updatedElement;

    localStorage.setItem('fieldGroups', JSON.stringify(groups));

    this.fgService.clickedForEdit.set(null);
    this.fgService.storageDataUpdates.set(true);
    alert('Successfully Updated');
  }

  onCancel(): void {
    this.fgService.clickedForEdit.set(null);
  }
}
