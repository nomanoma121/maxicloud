import {
  type InferOutput,
  object,
  pipe,
  safeParse,
  string,
  url,
} from "valibot";

const envSchema = object({
  BASE_URL: pipe(string(), url()),
});

let _ENV: InferOutput<typeof envSchema>;

export const initializeEnv = () => {
  const res = safeParse(envSchema, {
    BASE_URL: import.meta.env.VITE_BASE_URL,
  });

  if (!res.success) {
    throw new Error("[initializeEnv]: 環境変数が不正です");
  }

  _ENV = res.output;
};

export const env = (key: keyof typeof _ENV) => {
  if (!_ENV) initializeEnv();
  return _ENV[key];
};
