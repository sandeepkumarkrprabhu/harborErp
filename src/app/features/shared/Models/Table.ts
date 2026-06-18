export interface TableColumn<T = any> {
  key?: keyof T;
  label: string;
  width?: string;
  align?: 'left' | 'center' | 'right';
  cell?: (row: T) => string | number | null;
  headingClass?: string;
  cellClass?: string;
  avatar?: boolean;
}

export interface TableAction<T = any> {
  label: string;
  icon?: any;
  class?: string;
  handler: (row: T) => void;
  visible?: (row: T) => boolean;
}