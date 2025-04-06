import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component } from '@angular/core';
import { FieldElement, FieldGroup, FieldGroupRight } from '../../models/field-group.model';
import { FieldGroupService } from '../../service/field-group.service';
import { v4 as uuidv4 } from 'uuid';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-middle-pane',
  imports: [DragDropModule, NgIf, NgFor],
  templateUrl: './middle-pane.component.html',
  styleUrl: './middle-pane.component.scss'
})
export class MiddlePaneComponent {
  selectedGroup: FieldGroupRight | null = null;

  constructor(private fieldGroupService: FieldGroupService) {
    this.fieldGroupService.selectedGroup$.subscribe(group => {
      this.selectedGroup = group;
      console.log(this.selectedGroup);
      
    });
  }

  onDrop(event: DragEvent) {
    console.log(event);
    
    if (!this.selectedGroup) return;

    const json = event.dataTransfer?.getData('application/json');
    if (json) {
      
      const draggedElement = JSON.parse(json);
      console.log(draggedElement);
      const newField: FieldElement = {
        id: uuidv4(),
        type: draggedElement.type,
        label: draggedElement.label,
        placeholder: '',
        required: false
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

  onSelectElement(element: FieldElement) {
    // open right drawer (next step)
    console.log('Selected Element:', element);
  }

  editElement(item: any): void {

  }
  copyElement(item: any): void {

  }
  deleteElement(item: any): void {

  }

  handleDragEnd(event: any){
    console.log(event);
    
  }
  
}
