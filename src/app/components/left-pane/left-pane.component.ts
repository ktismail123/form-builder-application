import { Component, inject, OnInit } from '@angular/core';
import { FieldGroupService } from '../../service/field-group.service';
import { FieldGroup, FieldGroupRight } from '../../models/field-group.model';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { CdkDrag, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-left-pane',
  imports: [FormsModule, NgFor, AsyncPipe, NgIf, DragDropModule, NgClass],
  templateUrl: './left-pane.component.html',
  styleUrl: './left-pane.component.scss'
})
export class LeftPaneComponent implements OnInit {

  private fgService = inject(FieldGroupService)
  showAddForm = true
  // fieldGroups$ = this.fgService.fieldGroups$;
  fieldGroups: FieldGroupRight[] = [];
  selectedId: string | null = null;
  name = '';
  description = '';

  ngOnInit(): void {
    this.fgService.fieldGroups$.subscribe(groups => {
      this.fieldGroups = groups;
    });
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
    this.fgService.selectGroup(group);
  }

  handleCreateNew(){}
}
