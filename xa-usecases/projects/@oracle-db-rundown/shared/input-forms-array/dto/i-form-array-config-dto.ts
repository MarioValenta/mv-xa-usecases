export interface IFormArrayConfigDTO {
  rows: Array<{ fields: Array<IFormArrayFieldItemDTO> }>
}

export interface IFormArrayFieldItemDTO {
  type: string;
  required: boolean;
  formControlName: string;
  label: string;
  placeholder: string
}


