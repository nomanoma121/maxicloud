import * as v from "valibot";

export const CreateProjectSchema = v.object({
  name: v.pipe(
    v.string(),
    v.nonEmpty("Project名を入力してください"),
    v.regex(/^[A-Za-z0-9][-A-Za-z0-9_.]*[A-Za-z0-9]$/, "Project名は英数字とハイフン、アンダースコア、ピリオドのみ使用できます"),
    v.maxLength(64, "Project名は64文字以内で入力してください"),
  ),
  description: v.pipe(
    v.string(),
    v.maxLength(256, "説明は256文字以内で入力してください"),
  ),
  ownerId: v.pipe(
    v.string(),
    v.nonEmpty("Ownerを選択してください"),
  ),
});

export type CreateProjectInput = v.InferInput<typeof CreateProjectSchema>;
export type CreateProjectOutput = v.InferOutput<typeof CreateProjectSchema>;
