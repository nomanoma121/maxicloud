import { ErrorDisplay } from "~/components/ui/form/error-display";
import { FieldSet } from "~/components/ui/form/fieldset";
import { TextAreaField } from "~/components/ui/form/field/text-area";
import { TextInputField } from "~/components/ui/form/field/text-input";
import { SelectField } from "~/components/ui/form/field/select-field";
import { WithLabelField } from "~/components/ui/form/field/with-label";
import { Input } from "~/components/ui/form/input";
import { LabelText } from "~/components/ui/form/label-text";
import { Select } from "~/components/ui/form/select";
import { Textarea } from "~/components/ui/form/textarea";

export { Input, Select, Textarea, LabelText, FieldSet, ErrorDisplay };

export const Form = {
  Input,
  Select,
  Textarea,
  LabelText,
  FieldSet,
  ErrorDisplay,
  Field: {
    TextInput: TextInputField,
    TextArea: TextAreaField,
    Select: SelectField,
    WithLabel: WithLabelField,
  },
};
