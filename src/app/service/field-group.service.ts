import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { FieldGroup } from '../models/field-group.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class FieldGroupService {
  private fieldGroupsSubject = new BehaviorSubject<FieldGroup[]>([]);
  fieldGroups$ = this.fieldGroupsSubject.asObservable();

  private selectedGroupSubject = new BehaviorSubject<FieldGroup | null>(null);
  selectedGroup$ = this.selectedGroupSubject.asObservable();

  constructor() {
    const saved = localStorage.getItem('fieldGroups');
    const list = saved ? JSON.parse(saved) : [];
    this.fieldGroupsSubject.next(list);
  }

  private updateLocalStorage(groups: FieldGroup[]) {
    localStorage.setItem('fieldGroups', JSON.stringify(groups));
  }

  addGroup(name: string, description?: string) {
    const newGroup: FieldGroup = {
      id: uuidv4(),
      name,
      description
    };
    const updated = [...this.fieldGroupsSubject.value, newGroup];
    this.fieldGroupsSubject.next(updated);
    this.updateLocalStorage(updated);
  }

  deleteGroup(id: string) {
    const updated = this.fieldGroupsSubject.value.filter(g => g.id !== id);
    this.fieldGroupsSubject.next(updated);
    this.updateLocalStorage(updated);
  }

  selectGroup(group: FieldGroup) {
    this.selectedGroupSubject.next(group);
  }
}
