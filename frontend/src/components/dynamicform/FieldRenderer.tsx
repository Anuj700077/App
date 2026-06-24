import React from "react";

import TextInput from "./inputs/TextInput";
import TextareaInput from "./inputs/TextareaInput";
import NumberInput from "./inputs/NumberInput";
import DateInput from "./inputs/DateInput";
import DateRangeInput from "./inputs/DateRangeInput";
import TimePickerInput from "./inputs/TimePickerInput";
import CheckboxInput from "./inputs/CheckboxInput";
import ToggleInput from "./inputs/ToggleInput";
import RadioInput from "./inputs/RadioInput";
import SelectInput from "./inputs/SelectInput";
import ComboSelectInput from "./inputs/ComboSelectInput";
import FileInput from "./inputs/FileInput";
import FileViewInput from "./inputs/FileViewInput";
import ImageInput from "./inputs/ImageInput";
import AvatarInput from "./inputs/AvatarInput";
import ColorInput from "./inputs/ColorInput";
import SignatureInput from "./inputs/SignatureInput";
import LabelInput from "./inputs/LabelInput";
import TagsInput from "./inputs/TagsInput";
import LatLongInput from "./inputs/LatLongInput";

import ChecklistRuntime from "./checklist/ChecklistRuntime";

import type { DynamicField, FieldValue } from "./dynamicform.types";

type Props = {
  field: DynamicField;
  onChange?: (name: string, value: FieldValue) => void;
};

export default function FieldRenderer({ field, onChange }: Props) {
  switch (field.type) {
    case "text":
    case "email":
    case "password":
      return <TextInput field={field} onChange={onChange} />;
    case "number":
      return <NumberInput field={field} onChange={onChange} />;
    case "latlong":
      return <LatLongInput field={field} onChange={onChange} />;
    case "label":
      return <LabelInput field={field} />;
    case "tags":
      return <TagsInput field={field} onChange={onChange} />;
    case "textarea":
      return <TextareaInput field={field} onChange={onChange} />;
    case "date":
      return <DateInput field={field} onChange={onChange} />;
    case "daterange":
      return <DateRangeInput field={field} onChange={onChange} />;
    case "timepicker":
      return <TimePickerInput field={field} onChange={onChange} />;
    case "checkbox":
      return <CheckboxInput field={field} onChange={onChange} />;
    case "toggle":
      return <ToggleInput field={field} onChange={onChange} />;
    case "radio":
      return <RadioInput field={field} onChange={onChange} />;
    case "select":
    case "multiselect":
      return <SelectInput field={field} onChange={onChange} />;
    case "combo":
      return <ComboSelectInput field={field} onChange={onChange} />;
    case "file":
      return <FileInput field={field} onChange={onChange} />;
    case "file-view":
      return <FileViewInput field={field} onChange={onChange} />;
    case "image":
      return <ImageInput field={field} onChange={onChange} />;
    case "avatar":
      return <AvatarInput field={field} onChange={onChange} />;
    case "color":
      return <ColorInput field={field} onChange={onChange} />;
    case "signature":
      return <SignatureInput field={field} onChange={onChange} />;
    case "checklist":
      return <ChecklistRuntime field={field} onChange={onChange} />;
    default:
      return null;
  }
}
