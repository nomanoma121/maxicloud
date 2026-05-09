import { Box } from "react-feather";
import { useFormContext } from "react-hook-form";
import { css } from "styled-system/css";
import { Form } from "~/components/ui/form";
import type { CreateApplicationInputValues } from "../schema";
import { SectionHeading } from "./section-heading";

export const GeneralSection = () => {
	const {
		register,
		formState: { errors },
	} = useFormContext<CreateApplicationInputValues>();

	return (
		<section className={css({ display: "grid", gap: 3 })}>
			<SectionHeading
				icon={<Box size={15} />}
				title="1. General"
				description="サービス名を設定"
			/>
			<div className={css({ display: "grid", gap: 2 })}>
				<Form.Field.TextInput
					label="Application Name"
					required
					error={errors.applicationName?.message}
					{...register("applicationName")}
				/>
			</div>
		</section>
	);
};
