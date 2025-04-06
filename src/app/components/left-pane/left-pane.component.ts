import { Component, inject } from '@angular/core';
import { FieldGroupService } from '../../service/field-group.service';
import { FieldGroup } from '../../models/field-group.model';
import { FormsModule } from '@angular/forms';
import { AsyncPipe, NgFor } from '@angular/common';

@Component({
  selector: 'app-left-pane',
  imports: [FormsModule, NgFor, AsyncPipe],
  templateUrl: './left-pane.component.html',
  styleUrl: './left-pane.component.scss'
})
export class LeftPaneComponent {

  private fgService = inject(FieldGroupService)

  fieldGroups$ = this.fgService.fieldGroups$;
  selectedId: string | null = null;
  name = '';
  description = '';

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

  selectGroup(group: FieldGroup) {
    this.selectedId = group.id;
    this.fgService.selectGroup(group);
  }
}
