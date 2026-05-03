import { Sliders } from "react-feather";
import { css } from "styled-system/css";
import { Input, Select } from "~/components/ui/form-controls";
import type { ExposureMode } from "../hooks/use-application-create-form";
import { Field } from "./field";
import { ModeButton } from "./mode-button";
import { SectionHeading } from "./section-heading";

type ExposeSectionProps = {
  exposureMode: ExposureMode;
  setExposureMode: (value: ExposureMode) => void;
  port: string;
  setPort: (value: string) => void;
  domainPrefix: string;
  setDomainPrefix: (value: string) => void;
  setDomainEdited: (value: boolean) => void;
  domainSuffix: string;
  setDomainSuffix: (value: string) => void;
  checkDomainAvailability: () => Promise<boolean | undefined>;
  domainSuffixes: string[];
  isDomainAvailable: boolean | undefined;
  portError?: string;
};

export const ExposeSection = ({
  exposureMode,
  setExposureMode,
  port,
  setPort,
  domainPrefix,
  setDomainPrefix,
  setDomainEdited,
  domainSuffix,
  setDomainSuffix,
  checkDomainAvailability,
  domainSuffixes,
  isDomainAvailable,
  portError,
}: ExposeSectionProps) => {
  return (
    <section className={css({ display: "grid", gap: 3 })}>
      <SectionHeading icon={<Sliders size={15} />} title="4. Access" description="公開範囲と公開ポートを設定" />
      <Field label="Access">
        <div
          className={css({
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: 2,
            mdDown: { gridTemplateColumns: "1fr" },
          })}
        >
          <ModeButton
            active={exposureMode === "public"}
            title="Public"
            description="誰でもアクセス可能"
            onClick={() => setExposureMode("public")}
          />
          <ModeButton
            active={exposureMode === "idp"}
            title="Members Only"
            description="IdP認証済み会員のみ許可"
            onClick={() => setExposureMode("idp")}
          />
          <ModeButton
            active={exposureMode === "private"}
            title="Private"
            description="外部公開しない"
            onClick={() => setExposureMode("private")}
          />
        </div>
      </Field>
      {exposureMode !== "private" && (
        <>
          <div className={css({ display: "grid", gap: 2 })}>
            <p className={css({ margin: 0, color: "gray.600", fontSize: "sm", fontWeight: 600 })}>
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
              <Field label="Subdomain" labelClassName={css({ fontSize: "xs", color: "gray.500" })}>
                <Input
                  value={domainPrefix}
                  onChange={(event) => {
                    setDomainEdited(true);
                    setDomainPrefix(event.target.value);
                  }}
                  onBlur={() => {
                    void checkDomainAvailability();
                  }}
                />
              </Field>
              <Field label="Zone" labelClassName={css({ fontSize: "xs", color: "gray.500" })}>
                <Select
                  value={domainSuffix}
                  onChange={(event) => setDomainSuffix(event.target.value)}
                  onBlur={() => {
                    void checkDomainAvailability();
                  }}
                >
                  {domainSuffixes.map((suffix) => (
                    <option key={suffix} value={suffix}>
                      {suffix}
                    </option>
                  ))}
                </Select>
              </Field>
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
                {isDomainAvailable ? "Domain is available" : "Domain is already in use"}
              </p>
            )}
          </div>
          <Field label="Expose Port">
            <Input value={port} onChange={(event) => setPort(event.target.value)} placeholder="3000" />
          </Field>
          {portError && (
            <p className={css({ margin: 0, color: "red.700", fontSize: "xs", fontWeight: 600 })}>
              {portError}
            </p>
          )}
          <p className={css({ margin: 0, color: "gray.500", fontSize: "xs" })}>
            コンテナが待ち受けるポート番号を指定します（例: 3000）
          </p>
        </>
      )}
    </section>
  );
};
