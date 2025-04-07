import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { FieldGroupService } from '../../service/field-group.service';
import { FieldGroupRight } from '../../models/field-group.model';
import { FormsModule } from '@angular/forms';
import { NgFor, NgClass } from '@angular/common';
import { DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog';
import { FormGroupComponent } from '../form-group/form-group.component';
import { Subject, takeUntil } from 'rxjs';

@Component({
  selector: 'app-left-pane',
  imports: [FormsModule, NgFor, DragDropModule, NgClass],
  templateUrl: './left-pane.component.html',
  styleUrl: './left-pane.component.scss',
})
export class LeftPaneComponent implements OnInit, OnDestroy {
  private fgService = inject(FieldGroupService);
  private dialog = inject(MatDialog);
  private destroy$ = new Subject<void>();

  showAddForm = true;
  fieldGroups: FieldGroupRight[] = [];
  selectedId: string | null = localStorage.getItem('selectedId') || '';
  name = '';
  description = '';

  ngOnInit(): void {
    this.fgService.fieldGroups$
      .pipe(takeUntil(this.destroy$))
      .subscribe((groups) => {
        this.fieldGroups = groups;
      });

    if (this.selectedId && localStorage.getItem('fieldGroups')) {
      const raw = localStorage.getItem('fieldGroups');
      if (!raw) return;

      const data = JSON.parse(raw);
      const index = data.findIndex((item: any) => item.id === this.selectedId);
      if (index !== -1) {
        this.selectGroup(data[index]);
      }
    }
  }

  addGroup(): void {
    if (this.name.trim()) {
      this.fgService.addGroup(this.name, this.description);
      this.name = '';
      this.description = '';
    }
  }

  deleteGroup(id: string): void {
    this.fgService.deleteGroup(id);
  }

  drop(event: any): void {
    moveItemInArray(this.fieldGroups, event.previousIndex, event.currentIndex);
  }

  selectGroup(group: FieldGroupRight): void {
    this.selectedId = group.id;
    localStorage.setItem('selectedId', this.selectedId);
    this.fgService.setSelectedGroup(group);
  }

  handleCreateNew(): void {
    this.dialog
      .open(FormGroupComponent, {
        width: '500px',
        disableClose: false,
        data: { mode: 'create' },
      })
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        if (res?.success) {
          this.fgService
            .addGroup(res.data.name, res.data.description)
            .pipe(takeUntil(this.destroy$))
            .subscribe((addedGroup) => {
              this.selectedId = addedGroup.id;
              this.fgService.setSelectedGroup(addedGroup);
              alert('Successfully Added new Form Group!');
            });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
