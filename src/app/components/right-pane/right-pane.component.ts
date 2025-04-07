import { Component, ViewChild, ElementRef } from '@angular/core';
import { FORM_ELEMENTS } from '../../constants/form-elements.constant';
import { FormElement } from '../../models/form-element.model';
import { NgFor, NgIf } from '@angular/common';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-right-pane',
  standalone: true,
  imports: [NgFor, DragDropModule, FormsModule, NgIf],
  templateUrl: './right-pane.component.html',
  styleUrl: './right-pane.component.scss',
})
export class RightPaneComponent {
  formElementCategories = FORM_ELEMENTS;
  searchQuery = '';

  @ViewChild('importInput') importInputRef!: ElementRef<HTMLInputElement>;

  get filteredCategories() {
    const query = this.searchQuery.trim().toLowerCase();
    if (!query) return this.formElementCategories;

    return this.formElementCategories
      .map(group => ({
        category: group.category,
        items: group.items.filter(item =>
          item.label.toLowerCase().includes(query) ||
          item.description.toLowerCase().includes(query)
        )
      }))
      .filter(group => group.items.length > 0);
  }

  onDragStart(event: DragEvent, element: FormElement) {
    event.dataTransfer?.setData('application/json', JSON.stringify(element));
  }

  onExport(): void {
    const storedData = localStorage.getItem('fieldGroups');
    if (!storedData) {
      alert('No data found in local storage to export.');
      return;
    }

    const blob = new Blob([storedData], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'form-elements.json';
    a.click();
    URL.revokeObjectURL(url);
  }

  onImportClick(): void {
    this.importInputRef.nativeElement.click();
  }

  onImport(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      try {
        const result = reader.result as string;
        const parsedData = JSON.parse(result);

        if (!Array.isArray(parsedData)) {
          throw new Error('Imported data is not an array.');
        }

        // Optional: validate the structure of each group and elements here

        localStorage.setItem('fieldGroups', JSON.stringify(parsedData));
        alert('Import successful!');

        // Optional: trigger a global update or reload
        window.location.reload();
      } catch (error) {
        alert('Invalid JSON file.');
        console.error('Import error:', error);
      }
    };

    reader.readAsText(file);
    input.value = ''; // Reset file input so same file can be imported again if needed
  }
}
