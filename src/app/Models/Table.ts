import { LucideIconData } from 'lucide-angular';

export interface TableColumn {
  header: string;
  field: string;
  badge?: boolean;                // render this field as a badge
  bold?: boolean;                 // bold font
  italic?: boolean;               // italic font
  cursor?: string;                // cursor style (e.g. 'pointer')
  colorClass?: string;            // Tailwind color classes
  badgeColorMap?: { [key: string]: string }; // optional mapping of values → Tailwind classes
}


export interface TableAction {
  label: string;
  icon?: LucideIconData;   // ✅ correct type for Lucide icons
  color?: string;
  action: string;
}

export interface TableConfig {
  columns: TableColumn[];
  data: any[];
  actions: TableAction[];
}

