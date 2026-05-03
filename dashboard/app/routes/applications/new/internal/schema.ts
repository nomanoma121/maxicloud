import * as v from "valibot";

export const CreateApplicationSchema = v.object({
  projectId: v.pipe(v.string(), v.minLength(1, "プロジェクトを選択してください")),
  applicationName: v.pipe(
    v.string(),
    v.minLength(1, "アプリケーション名を入力してください"),
  ),
  repositoryId: v.pipe(v.string(), v.minLength(1, "リポジトリを選択してください")),
  branch: v.pipe(v.string(), v.minLength(1, "ブランチを選択してください")),
  dockerfileSource: v.union([v.literal("path"), v.literal("inline")]),
  dockerfilePath: v.string(),
  dockerfileInline: v.string(),
  exposureMode: v.union([v.literal("public"), v.literal("private"), v.literal("idp")]),
  domainPrefix: v.string(),
  domainSuffix: v.string(),
  domainEdited: v.boolean(),
  port: v.pipe(
    v.string(),
    v.minLength(1, "ポート番号を入力してください"),
    v.regex(/^\d+$/, "ポート番号は数字で入力してください"),
  ),
  envText: v.string(),
  secrets: v.array(
    v.object({
      id: v.string(),
      key: v.string(),
      value: v.string(),
    }),
  ),
});

export type CreateApplicationInputValues = v.InferInput<typeof CreateApplicationSchema>;

export const getPortError = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return "ポート番号を入力してください";
  if (!/^\d+$/.test(trimmed)) return "ポート番号は数字で入力してください";
  const port = Number.parseInt(trimmed, 10);
  if (port < 1 || port > 65535) return "ポート番号は1〜65535の範囲で指定してください";
  return undefined;
};

export const isValidPort = (value: string) => !getPortError(value);