import { FormElement } from '../models/form-element.model';

export const FORM_ELEMENTS: { category: string; items: FormElement[] }[] = [
  {
    category: 'TEXT',
    items: [
      {
        type: 'single-line-text',
        label: 'Single Line Text',
        description: 'Single text area',
        icon: 'fas fa-text-width',
        inputType: 'text'
      },
      {
        type: 'multi-line-text',
        label: 'Multi Line Text',
        description: 'Multi text area',
        icon: 'fas fa-align-left',
        inputType: 'textarea'
      },
      {
        type: 'integer',
        label: 'Integer',
        description: 'Integer type area',
        icon: 'fas fa-key',
        inputType: 'number'
      },
    ],
  },
  {
    category: 'DATE',
    items: [
      {
        type: 'date',
        label: 'Date',
        description: 'Select date from datepicker.',
        icon: 'fas fa-calendar-alt',
        inputType: 'date'
      },
      {
        type: 'time',
        label: 'Time',
        description: 'Select time from timepicker.',
        icon: 'fas fa-clock',
        inputType: 'time'
      },
      {
        type: 'datetime',
        label: 'Date & Time',
        description: 'Select date & time from picker.',
        icon: 'fas fa-calendar',
        inputType: 'date'
      },
    ],
  },
  {
    category: 'MULTI',
    items: [
      {
        type: 'single-select',
        label: 'Single Selection',
        description: 'Select single option.',
        icon: 'fas fa-circle',
        inputType: 'radio',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ]
      },
      {
        type: 'multi-select',
        label: 'Multi Selection',
        description: 'Select multiple options.',
        icon: 'fas fa-check-square',
         inputType: 'checkbox',
         options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ]
      },
      {
        type: 'dropdown',
        label: 'Dropdown',
        description: 'Select options from dropdown.',
        icon: 'fas fa-list',
        inputType: 'select',
        options: [
          { value: 'option1', label: 'Option 1' },
          { value: 'option2', label: 'Option 2' }
        ]
      },
    ],
  },
  {
    category: 'Media Fields',
    items: [
      {
        type: 'file',
        label: 'Upload',
        icon: 'fas fa-upload',
        description: 'Upload documents/media files.',
        inputType: 'file'
      },
    ],
  },
];
