import { FormElementType } from './form-element.model';

export interface FieldGroup {
  id: string;
  name: string;
  description?: string;
}

export interface FieldGroupRight {
  id: string;
  name: string;
  description?: string;
  elements: FieldElement[];
}

export interface FieldElement {
  id: string;
  type: FormElementType;
  label: string;
  placeholder?: string;
  required?: boolean;
  options?: string[]; // for dropdown, etc.
}
