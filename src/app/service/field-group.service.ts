import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FieldGroupRight } from '../models/field-group.model';
import { v4 as uuidv4 } from 'uuid';
import { toObservable } from '@angular/core/rxjs-interop';

@Injectable({ providedIn: 'root' })
export class FieldGroupService {
  private fieldGroupsSubject = new BehaviorSubject<FieldGroupRight[]>([]);
  fieldGroups$ = this.fieldGroupsSubject.asObservable();

  private selectedGroupSubject = new BehaviorSubject<FieldGroupRight | null>(null);
  selectedGroup$ = this.selectedGroupSubject.asObservable();

  clickedForEdit = signal<any>(null);
  clickedForEdit$ = toObservable(this.clickedForEdit);

  storageDataUpdates = signal<boolean>(false);
  storageDataUpdates$ = toObservable(this.storageDataUpdates);

  constructor() {
    this.refreshFromStorage();
  }

  // ===============================
  // 🔁 Storage Helper Methods
  // ===============================

  private getLocalGroups(): FieldGroupRight[] {
    try {
      const raw = localStorage.getItem('fieldGroups');
      return raw ? JSON.parse(raw) : [];
    } catch (error) {
      console.error('Failed to parse fieldGroups from local storage:', error);
      return [];
    }
  }

  private getSelectedId(): string | null {
    return localStorage.getItem('selectedId');
  }

  private updateLocalStorage(groups: FieldGroupRight[]) {
    localStorage.setItem('fieldGroups', JSON.stringify(groups));
  }

  refreshFromStorage() {
    const list = this.getLocalGroups();
    this.fieldGroupsSubject.next(Array.isArray(list) ? list : []);
  }

  // ===============================
  // ➕ Add Group
  // ===============================

  addGroup(name: string, description?: string): Observable<any> {
    const newGroup: FieldGroupRight = {
      id: uuidv4(),
      name,
      description,
      elements: []
    };
    const updated = [...this.fieldGroupsSubject.value, newGroup];
    this.fieldGroupsSubject.next(updated);
    this.updateLocalStorage(updated);
    return of(newGroup);
  }

  // ===============================
  // ✏️ Edit Group
  // ===============================

  editGroup(id: string, updatedName: string, updatedDescription?: string): void {
    const currentGroups = this.fieldGroupsSubject.value;

    const updatedGroups = currentGroups.map(group => {
      if (group.id === id) {
        return {
          ...group,
          name: updatedName,
          description: updatedDescription
        };
      }
      return group;
    });

    this.fieldGroupsSubject.next(updatedGroups);
    this.updateLocalStorage(updatedGroups);
  }

  // ===============================
  // ❌ Delete Group
  // ===============================

  deleteGroup(id: string): Observable<{ success: boolean }> {
    const updated = this.fieldGroupsSubject.value.filter(g => g.id !== id);
    this.fieldGroupsSubject.next(updated);
    this.updateLocalStorage(updated);
    return of({ success: true });
  }

  // ===============================
  // ✅ Select Group
  // ===============================

  setSelectedGroup(group: FieldGroupRight) {
    this.selectedGroupSubject.next(group);
  }

  // ===============================
  // 🔄 Update Elements
  // ===============================

  updateElements(elements: FieldGroupRight['elements']) {
    const current = this.selectedGroupSubject.value;
    if (!current) return;

    const updatedGroup = { ...current, elements };
    this.selectedGroupSubject.next(updatedGroup);
    this.updateFormElement(updatedGroup);
  }

  updateFormElement(updatedGroup: FieldGroupRight) {
    const groups = this.getLocalGroups();
    const index = groups.findIndex(g => g.id === updatedGroup.id);
    if (index === -1) return;

    groups[index] = updatedGroup;
    this.updateLocalStorage(groups);
    this.fieldGroupsSubject.next(groups);
  }

  // ===============================
  // 🗑️ Delete Single Form Element
  // ===============================

  deleteFormElement(el_id: string): Observable<{ success: boolean }> {
    const data = this.getLocalGroups();
    const id = this.getSelectedId();
    if (!id) return of({ success: false });

    const index = data.findIndex(group => group.id === id);
    if (index === -1) return of({ success: false });

    const group = data[index];
    group.elements = group.elements.filter(el => el.id !== el_id);
    data[index] = group;

    this.updateLocalStorage(data);
    this.fieldGroupsSubject.next(data);

    return of({ success: true });
  }
}
