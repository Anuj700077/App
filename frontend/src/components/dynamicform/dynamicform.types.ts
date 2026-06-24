export type FieldValue =
  | string
  | number
  | boolean
  | null
  | undefined
  | string[]
  | number[]
  | Record<string, any>
  | any[];

export type DropdownStatus = "active" | "inactive" | "all";
export type DropdownMode = "label" | "codeLabel";

export type DynamicOption = {
  label: string;
  value: string;
  code?: string;
  disabled?: boolean;
  [key: string]: any;
};

export type DynamicFieldType =
  | "header"
  | "paragraph"
  | "divider"
  | "spacer"
  | "note"
  | "text"
  | "email"
  | "password"
  | "number"
  | "textarea"
  | "label"
  | "select"
  | "multiselect"
  | "combo"
  | "radio"
  | "checkbox"
  | "toggle"
  | "date"
  | "daterange"
  | "timepicker"
  | "latlong"
  | "tags"
  | "color"
  | "file"
  | "file-view"
  | "image"
  | "avatar"
  | "signature"
  | "checklist";

export type NoteVariant = "info" | "warning" | "error" | "success";

export type DateRangeValue = { from?: string; to?: string };
export type LatLongValue = { text?: string; dir?: string; value?: string };

export type DynamicField = {
  name: string;
  type: DynamicFieldType;

  label?: string;
  value?: FieldValue;
  placeholder?: string;

  col?: number;
  required?: boolean;
  readonly?: boolean;
  disabled?: boolean;

  help?: boolean;
  helpText?: string;
  helperRight?: string;

  options?: DynamicOption[];

  dropdownKey?: string;
  dropdownStatus?: DropdownStatus;
  dropdownMode?: DropdownMode;
  setFirstValue?: boolean;
  _dropdownLoading?: boolean;

  headerLevel?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";

  noteVariant?: NoteVariant;
  height?: number;

  max?: number;
  min?: number;
  fromYear?: number;
  toYear?: number;
  accept?: string;

  latLongMode?: "latitude" | "longitude";
  direction?: "N" | "S" | "E" | "W";

  viewTitle?: string;
  viewSubtitle?: string;
  forcePdfViewer?: boolean;

  keyboardType?: "default" | "numeric" | "email-address" | "phone-pad";
  multiline?: boolean;

  onKeyDown?: any;

  [key: string]: any;
};

export type DynamicFormDropdownState = {
  emptyKeys: string[];
  missingKeys: string[];
  loading: boolean;
  error?: string;
};

export type DynamicFormProps = {
  fields: DynamicField[];
  onChange?: (name: string, value: FieldValue) => void;
  layout?: 12 | 8 | 6;
  onDropdownStateChange?: (s: DynamicFormDropdownState) => void;
};
