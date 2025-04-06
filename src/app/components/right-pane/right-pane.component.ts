import { Component } from '@angular/core';
import { FORM_ELEMENTS } from '../../constants/form-elements.constant';
import { FormElement } from '../../models/form-element.model';
import { NgFor } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-right-pane',
  imports: [NgFor, DragDropModule, FormsModule],
  templateUrl: './right-pane.component.html',
  styleUrl: './right-pane.component.scss'
})
export class RightPaneComponent {
  formElementCategories = FORM_ELEMENTS;
  searchQuery = ''
  onDragStart(event: DragEvent, element: FormElement) {
    event.dataTransfer?.setData('application/json', JSON.stringify(element));
  }

  onDrop(ev: any): void {
    console.log(ev);
    
  }
  
}
