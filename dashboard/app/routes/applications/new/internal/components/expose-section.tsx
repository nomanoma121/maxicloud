import { useState } from "react";
import { Sliders } from "react-feather";
import { useFormContext, useWatch } from "react-hook-form";
import { css } from "styled-system/css";
import { Form } from "~/components/ui/form";
import { CREATE_APPLICATION_ACCESS_MODE } from "~/constants";
import {
	useAvailableDomains,
	useDomainAvailability,
} from "../hooks/use-domain";
import type { CreateApplicationInputValues } from "../schema";
import { ModeButton } from "./mode-button";
import { SectionHeading } from "./section-heading";

export const ExposeSection = () => {
	const {
		register,
		setValue,
		control,
		formState: { errors },
	} = useFormContext<CreateApplicationInputValues>();
	const exposureMode = useWatch({ control, name: "exposureMode" });
	const domainPrefix = useWatch({ control, name: "domainPrefix" }) ?? "";
	const domainSuffix = useWatch({ control, name: "domainSuffix" }) ?? "";
	const { data: availableDomains = [] } = useAvailableDomains();
	const [checkedDomainKey, setCheckedDomainKey] = useState("");

	const trimmedDomainPrefix = domainPrefix.trim();
	const trimmedDomainSuffix = domainSuffix.trim();
	const currentDomainKey = `${trimmedDomainPrefix}:${trimmedDomainSuffix}`;
	const domainCheckable =
		exposureMode !== CREATE_APPLICATION_ACCESS_MODE.PRIVATE &&
		trimmedDomainPrefix.length > 0 &&
		trimmedDomainSuffix.length > 0;

	const domainAvailabilityQuery = useDomainAvailability({
		subdomain: trimmedDomainPrefix,
		rootDomain: trimmedDomainSuffix,
		enabled: false,
	});

	const checkDomainAvailability = async () => {
		if (!domainCheckable) return undefined;
		const result = await domainAvailabilityQuery.refetch();
		setCheckedDomainKey(currentDomainKey);
		return result.data;
	};

	const isDomainAvailable =
		checkedDomainKey === currentDomainKey
			? domainAvailabilityQuery.data
			: undefined;

	const domainPrefixField = register("domainPrefix", {
		onChange: () => setValue("domainEdited", true, { shouldDirty: true }),
	});
	const domainSuffixField = register("domainSuffix");

	return (
		<section className={css({ display: "grid", gap: 3 })}>
			<SectionHeading
				icon={<Sliders size={15} />}
				title="4. Access"
				description="公開範囲と公開ポートを設定"
			/>
			<Form.Field.WithLabel label="Access">
				{() => (
					<div
						className={css({
							display: "grid",
							gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
							gap: 2,
							mdDown: { gridTemplateColumns: "1fr" },
						})}
					>
						<ModeButton
							active={exposureMode === CREATE_APPLICATION_ACCESS_MODE.PUBLIC}
							title="Public"
							description="誰でもアクセス可能"
							onClick={() =>
								setValue(
									"exposureMode",
									CREATE_APPLICATION_ACCESS_MODE.PUBLIC,
									{ shouldDirty: true },
								)
							}
						/>
						<ModeButton
							active={exposureMode === CREATE_APPLICATION_ACCESS_MODE.IDP}
							title="Members Only"
							description="IdP認証済み会員のみ許可"
							onClick={() =>
								setValue("exposureMode", CREATE_APPLICATION_ACCESS_MODE.IDP, {
									shouldDirty: true,
								})
							}
						/>
						<ModeButton
							active={exposureMode === CREATE_APPLICATION_ACCESS_MODE.PRIVATE}
							title="Private"
							description="外部公開しない"
							onClick={() =>
								setValue(
									"exposureMode",
									CREATE_APPLICATION_ACCESS_MODE.PRIVATE,
									{ shouldDirty: true },
								)
							}
						/>
					</div>
				)}
			</Form.Field.WithLabel>
			{exposureMode !== CREATE_APPLICATION_ACCESS_MODE.PRIVATE && (
				<>
					<div className={css({ display: "grid", gap: 2 })}>
						<p
							className={css({
								margin: 0,
								color: "gray.600",
								fontSize: "sm",
								fontWeight: 600,
							})}
						>
							Domain Registration
						</p>
						<div
							className={css({
								display: "grid",
								gridTemplateColumns: "1fr 1fr",
								gap: 2,
								mdDown: { gridTemplateColumns: "1fr" },
							})}
						>
							<Form.Field.WithLabel label="サブドメイン">
								{(id) => (
									<Form.Input
										id={id}
										{...domainPrefixField}
										onBlur={(event) => {
											domainPrefixField.onBlur(event);
											void checkDomainAvailability();
										}}
									/>
								)}
							</Form.Field.WithLabel>
							<Form.Field.WithLabel label="ルートドメイン">
								{(id) => (
									<>
										<Form.Select
											id={id}
											{...domainSuffixField}
											onBlur={(event) => {
												domainSuffixField.onBlur(event);
												void checkDomainAvailability();
											}}
										>
											<option value="">選択してください</option>
											{availableDomains.map((suffix) => (
												<option key={suffix} value={suffix}>
													{suffix}
												</option>
											))}
										</Form.Select>
									</>
								)}
							</Form.Field.WithLabel>
						</div>
						{isDomainAvailable !== undefined && (
							<p
								className={css({
									margin: 0,
									color: isDomainAvailable ? "green.700" : "red.700",
									fontSize: "xs",
									fontWeight: 600,
								})}
							>
								{isDomainAvailable
									? "Domain is available"
									: "Domain is already in use"}
							</p>
						)}
					</div>
					<Form.Field.TextInput
						label="Expose Port"
						required
						error={errors.port?.message}
						placeholder="3000"
						{...register("port")}
					/>
				</>
			)}
		</section>
	);
};
