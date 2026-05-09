import { ErrorDisplay } from "~/components/ui/form/error-display";
import { SelectField } from "~/components/ui/form/field/select-field";
import { TextAreaField } from "~/components/ui/form/field/text-area";
import { TextInputField } from "~/components/ui/form/field/text-input";
import { WithLabelField } from "~/components/ui/form/field/with-label";
import { FieldSet } from "~/components/ui/form/fieldset";
import { Input } from "~/components/ui/form/input";
import { LabelText } from "~/components/ui/form/label-text";
import { Select } from "~/components/ui/form/select";
import { Textarea } from "~/components/ui/form/textarea";

export { ErrorDisplay, FieldSet, Input, LabelText, Select, Textarea };

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
