export type FormElementType =
  | 'single-line-text'
  | 'multi-line-text'
  | 'integer'
  | 'date'
  | 'time'
  | 'datetime'
  | 'dropdown'
  | 'single-select'
  | 'multi-select'
  | 'file';

export interface FormElement {
  type: FormElementType;
  label: string;
  icon: string;
  description: string
}
