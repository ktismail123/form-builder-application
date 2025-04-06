import { FormElement } from '../models/form-element.model';

export const FORM_ELEMENTS: { category: string; items: FormElement[] }[] = [
//   {
//     category: 'Text Fields',
//     items: [
//       { type: 'single-line-text', label: 'Single Line Text', icon: '📝' },
//       { type: 'multi-line-text', label: 'Multi Line Text', icon: '📄' }
//     ]
//   },
//   {
//     category: 'Date/Time Fields',
//     items: [
//       { type: 'date', label: 'Date', icon: '📅' },
//       { type: 'time', label: 'Time', icon: '⏰' },
//       { type: 'datetime', label: 'Date & Time', icon: '🕒' }
//     ]
//   },
//   {
//     category: 'Selection Fields',
//     items: [
//       { type: 'dropdown', label: 'Dropdown', icon: '🔽' },
//       { type: 'single-select', label: 'Single Select', icon: '🔘' },
//       { type: 'multi-select', label: 'Multi Select', icon: '☑️' }
//     ]
//   },
//   {
//     category: 'Media Fields',
//     items: [
//       { type: 'file-upload', label: 'Upload Field', icon: '📤' }
//     ]
//   },
{
    category: 'TEXT',
    items: [
      { type: 'single-line-text', label: 'Single Line Text', description: 'Single text area', icon: 'fas fa-text-width' },
      { type: 'multi-line-text', label: 'Multi Line Text', description: 'Multi text area', icon: 'fas fa-align-left' },
      { type: 'integer', label: 'Integer', description: 'Integer type area', icon: 'fas fa-key' }
    ]
  },
  {
    category: 'DATE',
    items: [
      { type: 'date', label: 'Date', description: 'Select date from datepicker.', icon: 'fas fa-calendar-alt' },
      { type: 'time', label: 'Time', description: 'Select time from timepicker.', icon: 'fas fa-clock' },
      { type: 'datetime', label: 'Date & Time', description: 'Select date & time from picker.', icon: 'fas fa-calendar' }
    ]
  },
  {
    category: 'MULTI',
    items: [
      { type: 'single-select', label: 'Single Selection', description: 'Select single option.', icon: 'fas fa-circle' },
      { type: 'multi-select', label: 'Multi Selection', description: 'Select multiple options.', icon: 'fas fa-check-square' },
      { type: 'dropdown', label: 'Dropdown', description: 'Select options from dropdown.', icon: 'fas fa-list' }
    ]
  },
  {
        category: 'Media Fields',
        items: [
          { type: 'file-upload', label: 'Upload', icon: 'fas fa-upload', description: 'Upload documents/media files.' }
        ]
      },
];
