import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { FieldGroup, FieldGroupRight } from '../models/field-group.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({ providedIn: 'root' })
export class FieldGroupService {
  private fieldGroupsSubject = new BehaviorSubject<FieldGroupRight[]>([]);
  fieldGroups$ = this.fieldGroupsSubject.asObservable();

  private selectedGroupSubject = new BehaviorSubject<FieldGroupRight | null>(null);
  selectedGroup$ = this.selectedGroupSubject.asObservable();

  constructor() {
    // const saved = localStorage.getItem('fieldGroups');
    // const list = saved ? JSON.parse(saved) : [];
    // this.fieldGroupsSubject.next(list);
    try {
      const saved = localStorage.getItem('fieldGroups');
      const list: FieldGroupRight[] = saved ? JSON.parse(saved) : [];
      this.fieldGroupsSubject.next(Array.isArray(list) ? list : []);
    } catch (error) {
      console.error('Failed to parse fieldGroups from local storage:', error);
      this.fieldGroupsSubject.next([]);
    }
  }

  private updateLocalStorage(groups: FieldGroupRight[]) {
    localStorage.setItem('fieldGroups', JSON.stringify(groups));
  }

  addGroup(name: string, description?: string):Observable<any> {
    const newGroup: FieldGroupRight = {
      id: uuidv4(),
      name,
      description,
      elements: []
    };
    const updated = [...this.fieldGroupsSubject.value, newGroup];
    this.fieldGroupsSubject.next(updated);
    this.updateLocalStorage(updated);
    return of(newGroup)
  }

  editGroup(id: string, updatedName: string, updatedDescription?: string) {
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
  

  deleteGroup(id: string):  Observable<any> {
    const updated = this.fieldGroupsSubject.value.filter(g => g.id !== id);
    this.fieldGroupsSubject.next(updated);
    this.updateLocalStorage(updated);
    return of({success: true})
  }

  selectGroup(group: FieldGroupRight) {
    this.selectedGroupSubject.next(group);
  }

  setSelectedGroup(group: FieldGroupRight) {
    this.selectedGroupSubject.next(group);
  }

  updateElements(elements: FieldGroupRight['elements']) {
    const current = this.selectedGroupSubject.value;
    if (current) {
      this.selectedGroupSubject.next({ ...current, elements });
      console.log({ ...current, elements });
      
      const latestWithElements = { ...current, elements };
      // this.updateLocalStorage(latestWithElements);
      this.updateFormElement(latestWithElements);
    }
  }

  updateFormElement(inewElements: FieldGroupRight) {
    // Get data from local storage
    const raw = localStorage.getItem('fieldGroups');
    const id = localStorage.getItem('selectedId');
    if (!raw) return;
  
    // Parse it
    const data = JSON.parse(raw);
  
    // Find the index
    const index = data.findIndex((item: any) => item.id === id);
    if (index === -1) return;
  
    // Update the elements array
    data[index] = inewElements;
  
    // Save it back to local storage
    // localStorage.setItem('canvasData', JSON.stringify(data));
    this.updateLocalStorage(data);

  }
  
  deleteFormElement(el_id: string): Observable<{ success: boolean }> {
    const raw = localStorage.getItem('fieldGroups');
    const id = localStorage.getItem('selectedId');
    if (!raw || !id) return of({ success: false });
  
    const data = JSON.parse(raw);
  
    // Find the group by ID
    const index = data.findIndex((group: any) => group.id === id);
    if (index === -1) return of({ success: false });
  
    const group = data[index];
  
    // Filter out the element to delete
    group.elements = group.elements.filter((el: any) => el.id !== el_id);
  
    // Replace the group in the array
    data[index] = group;
  
    // Save back to local storage
    this.updateLocalStorage(data);
    this.fieldGroupsSubject.next(data);
  
    return of({ success: true });
  }
  
  

}
