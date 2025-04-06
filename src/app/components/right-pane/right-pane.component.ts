import { Component } from '@angular/core';
import { FORM_ELEMENTS } from '../../constants/form-elements.constant';
import { FormElement,  } from '../../models/form-element.model';
import { NgFor, NgIf } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-right-pane',
  standalone: true,
  imports: [NgFor, DragDropModule, FormsModule, NgIf],
  templateUrl: './right-pane.component.html',
  styleUrl: './right-pane.component.scss'
})
export class RightPaneComponent {
  formElementCategories = FORM_ELEMENTS;
  searchQuery: string = '';

  onDragStart(event: DragEvent, element: FormElement): void {
    event.dataTransfer?.setData('application/json', JSON.stringify(element));
  }

  get filteredCategories(): { category: string; items: FormElement[] }[] {
    const query = this.searchQuery.trim().toLowerCase();

    if (!query) return this.formElementCategories;

    return this.formElementCategories
      .map(group => ({
        ...group,
        items: group.items.filter(item =>
          item.label.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        )
      }))
      .filter(group => group.items.length > 0);
  }
}
