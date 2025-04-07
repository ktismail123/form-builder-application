import {
  CdkDragDrop,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { Component, inject, OnDestroy } from '@angular/core';
import {
  FieldElement,
  FieldGroupRight,
} from '../../models/field-group.model';
import { FieldGroupService } from '../../service/field-group.service';
import { v4 as uuidv4 } from 'uuid';
import { NgFor, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormGroupComponent } from '../form-group/form-group.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-middle-pane',
  imports: [DragDropModule, NgFor],
  templateUrl: './middle-pane.component.html',
  styleUrl: './middle-pane.component.scss',
})
export class MiddlePaneComponent implements OnDestroy {
  private dialog = inject(MatDialog);
  private fgService = inject(FieldGroupService);
  private fieldGroupService = inject(FieldGroupService);
  private destroy$ = new Subject<void>();

  selectedGroup: FieldGroupRight | null = null;
  copied = false;
  copiedElement = false;
  copiedIndex = 0;

  constructor() {
    this.fieldGroupService.selectedGroup$
      .pipe(takeUntil(this.destroy$))
      .subscribe((group) => {
        this.selectedGroup = group;
      });

    this.fieldGroupService.storageDataUpdates$
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res) {
          const raw = localStorage.getItem('fieldGroups');
          const selectedGroupId = localStorage.getItem('selectedId');
          if (!raw || !selectedGroupId) return;

          const data = JSON.parse(raw);
          const groupIndex = data.findIndex(
            (group: any) => group.id === selectedGroupId
          );
          if (groupIndex === -1) return;

          this.selectedGroup = data[groupIndex];
        }
        this.fieldGroupService.storageDataUpdates.set(false);
      });
  }

  onDrop(event: DragEvent) {
    if (!this.selectedGroup) return;

    const json = event.dataTransfer?.getData('application/json');
    if (json) {
      const draggedElement = JSON.parse(json);
      const newField: FieldElement = {
        id: uuidv4(),
        type: draggedElement.type,
        label: draggedElement.label,
        placeholder: '',
        required: false,
        inputType: draggedElement.inputType,
        options: draggedElement.options,
        description: draggedElement.description,
      };
      const updated = [...this.selectedGroup.elements, newField];
      this.fieldGroupService.updateElements(updated);
    }
  }

  reorder(event: CdkDragDrop<FieldElement[]>) {
    if (!this.selectedGroup) return;
    const items = [...this.selectedGroup.elements];
    moveItemInArray(items, event.previousIndex, event.currentIndex);
    this.fieldGroupService.updateElements(items);
  }

  onSelectElement(element: FieldElement) {}

  editGroup(item: any): void {
    this.dialog
      .open(FormGroupComponent, {
        width: '500px',
        disableClose: false,
        data: {
          mode: 'edit',
          name: item?.name,
          description: item?.description,
        },
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res.success) {
          this.fgService.editGroup(
            item.id,
            res?.data?.name,
            res?.data?.description
          );
          this.fgService.setSelectedGroup({
            ...item,
            name: res?.data?.name,
            description: res?.data?.description,
          });
          alert('Updated Successfully!');
        }
      });
  }

  copyItem(item: any): void {
    this.copied = true;
    navigator.clipboard
      .writeText(item?.name)
      .then(() => {
        setTimeout(() => {
          this.copied = false;
        }, 1000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  }

  deleteItem(item: any): void {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this item?'
    );

    if (isConfirmed) {
      this.fgService.deleteGroup(item.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res.success) {
            this.selectedGroup = null;
          }
        });
      alert('Successfully Deleted');
    }
  }

  deleteElement(item: any) {
    const isConfirmed = window.confirm(
      'Are you sure you want to delete this item?'
    );

    if (isConfirmed) {
      this.fgService.deleteFormElement(item.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          if (res.success) {
            this.selectedGroup = {
              ...this.selectedGroup,
              elements: (this.selectedGroup?.elements ?? []).filter(
                (el_item) => el_item.id !== item.id
              ),
            } as FieldGroupRight;
          }
        });
      alert('Successfully Deleted');
    }
  }

  copyElement(item: any, index: number): void {
    this.copiedIndex = index;
    // Placeholder for future logic
    this.copiedElement = true;
    navigator.clipboard
      .writeText(item?.name)
      .then(() => {
        setTimeout(() => {
          this.copiedElement = false;
        }, 1000);
      })
      .catch((err) => {
        console.error('Failed to copy text: ', err);
      });
  }

  editElement(event: any) {
    this.fgService.clickedForEdit.set({ data: event });
  }

  handleDragEnd(event: CdkDragDrop<Element[]>) {
    if (this.selectedGroup) {
      moveItemInArray(
        this.selectedGroup.elements,
        event.previousIndex,
        event.currentIndex
      );

      const allGroups = JSON.parse(localStorage.getItem('fieldGroups') || '[]');

      const updatedGroups = allGroups.map((group: any) => {
        if (group.id === this.selectedGroup!.id) {
          return {
            ...group,
            elements: this.selectedGroup!.elements,
          };
        }
        return group;
      });

      localStorage.setItem('fieldGroups', JSON.stringify(updatedGroups));
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
