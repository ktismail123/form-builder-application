import { Component, inject, OnInit } from '@angular/core';
import { FieldGroupService } from '../../service/field-group.service';
import { FieldGroup, FieldGroupRight } from '../../models/field-group.model';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  CdkDrag,
  DragDropModule,
  moveItemInArray,
} from '@angular/cdk/drag-drop';
import { MatDialog } from '@angular/material/dialog'
import { FormGroupComponent } from '../form-group/form-group.component';

@Component({
  selector: 'app-left-pane',
  imports: [FormsModule, NgFor, DragDropModule, NgClass],
  templateUrl: './left-pane.component.html',
  styleUrl: './left-pane.component.scss',
})
export class LeftPaneComponent implements OnInit {
  private fgService = inject(FieldGroupService);
  private dialog = inject(MatDialog);
  showAddForm = true;
  // fieldGroups$ = this.fgService.fieldGroups$;
  fieldGroups: FieldGroupRight[] = [];
  selectedId: string | null = localStorage.getItem('selectedId') || '';
  name = '';
  description = '';

  ngOnInit(): void {
    this.fgService.fieldGroups$.subscribe((groups) => {
      this.fieldGroups = groups;
    });

    if (this.selectedId && localStorage.getItem('fieldGroups')) {
      const raw = localStorage.getItem('fieldGroups');
      if (!raw) return;
      // Parse it
      const data = JSON.parse(raw);
      const index = data.findIndex((item: any) => item.id === this.selectedId);
      if (index === -1) return;

      this.selectGroup(data[index]);
    }
  }

  addGroup() {
    if (this.name.trim()) {
      this.fgService.addGroup(this.name, this.description);
      this.name = '';
      this.description = '';
    }
  }

  deleteGroup(id: string) {
    this.fgService.deleteGroup(id);
  }

  drop(event: any) {
    moveItemInArray(this.fieldGroups, event.previousIndex, event.currentIndex);

    
  }

  selectGroup(group: FieldGroupRight) {
    this.selectedId = group.id;
    localStorage.setItem('selectedId', this.selectedId);
    this.fgService.selectGroup(group);
  }

  handleCreateNew() {
    this.dialog.open(FormGroupComponent, {
      width: '500px',
      disableClose: false,
      data: {mode: 'create'}
    }).afterClosed().subscribe(res => {
      console.log(res);
      if (res.success) {
        this.fgService.addGroup(res?.data?.name, res?.data?.description).subscribe(res => {
          this.selectedId = res.id;
          this.fgService.selectGroup(res);
        })
        alert('Successfully Added new Form Group!');
      }
    })
  }
}
