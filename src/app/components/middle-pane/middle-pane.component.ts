import { CdkDragDrop, DragDropModule, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, inject } from '@angular/core';
import { FieldElement, FieldGroup, FieldGroupRight } from '../../models/field-group.model';
import { FieldGroupService } from '../../service/field-group.service';
import { v4 as uuidv4 } from 'uuid';
import { NgFor, NgIf } from '@angular/common';
import { MatDialog } from '@angular/material/dialog';
import { FormGroupComponent } from '../form-group/form-group.component';

@Component({
  selector: 'app-middle-pane',
  imports: [DragDropModule, NgIf, NgFor],
  templateUrl: './middle-pane.component.html',
  styleUrl: './middle-pane.component.scss'
})
export class MiddlePaneComponent {

  private dialog = inject(MatDialog);
  private fgService = inject(FieldGroupService);
  private fieldGroupService = inject(FieldGroupService);

  selectedGroup: FieldGroupRight | null = null;
  copied = false;

  constructor() {
    this.fieldGroupService.selectedGroup$.subscribe(group => {
      this.selectedGroup = group;
      console.log(this.selectedGroup);
      
    });
  }

  onDrop(event: DragEvent) {
    
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
    this.dialog.open(FormGroupComponent, {
      width: '500px',
      disableClose: false,
      data: {
        mode: 'edit',
        name: item?.name,
        description: item?.description
      }
    }).afterClosed().subscribe(res => {
      console.log(item);
      if (res.success) {
        this.fgService.editGroup(item.id ,res?.data?.name, res?.data?.description);
        this.fgService.selectGroup({...item, name: res?.data?.name, description: res?.data?.description});
        alert('Updated Successfully!');
      }
    })
  
  }
  copyElement(item: any): void {
    this.copied = true;
    navigator.clipboard.writeText(item?.name).then(() => {
      console.log('Text copied to clipboard');

      setTimeout(() => {
        this.copied = false;
      }, 1000);

    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  }
  
  deleteItem(item: any): void {
    const isConfirmed = window.confirm('Are you sure you want to delete this item?');
    
    if (isConfirmed) {
      this.fgService.deleteGroup(item.id).subscribe(res => {
        if(res.success){
          this.selectedGroup = null;
        }
      })
      console.log('Item deleted:', item);
      alert('Succesfully Deleted');
    } else {
      // Cancelled
      console.log('Delete cancelled');
    }
  }

  deleteElement(item: any){
    console.log(item);

    const isConfirmed = window.confirm('Are you sure you want to delete this item?');
    
    if (isConfirmed) {
      this.fgService.deleteFormElement(item.id).subscribe(res => {
        if(res.success){
          // this.selectedGroup = null;
          this.selectedGroup = {
            ...this.selectedGroup,
            elements: (this.selectedGroup?.elements ?? []).filter(el_item => el_item.id !== item.id)
          } as FieldGroupRight;
          
          
        }
      })
      alert('Succesfully Deleted');
    } else {
      // Cancelled
      console.log('Delete cancelled');
    }
    
  }
  

  handleDragEnd(event: CdkDragDrop<Element[]>) {
    if (this.selectedGroup) {
      moveItemInArray(this.selectedGroup.elements, event.previousIndex, event.currentIndex);
  
      // Now update the local storage
      const allGroups = JSON.parse(localStorage.getItem('fieldGroups') || '[]');
  
      const updatedGroups = allGroups.map((group: any) => {
        if (group.id === this.selectedGroup!.id) {
          return {
            ...group,
            elements: this.selectedGroup!.elements
          };
        }
        return group;
      });
  
      localStorage.setItem('fieldGroups', JSON.stringify(updatedGroups));
    }
  }
  

  
  
     
}
