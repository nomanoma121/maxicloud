import { Link, useNavigate } from "react-router";
import { css } from "styled-system/css";
import { Button } from "~/components/ui/button";
import { Input, Textarea } from "~/components/ui/form-controls";

export default function RegisterPage() {
  const navigate = useNavigate();

  return (
    <div
      className={css({
        width: "100%",
        minHeight: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        padding: 4,
      })}
    >
      <section
        className={css({
          width: "100%",
          maxWidth: "620px",
          background: "white",
          borderRadius: "md",
          border: "1px solid",
          borderColor: "gray.100",
          padding: 6,
          display: "grid",
          gap: 4,
        })}
      >
        <div>
          <h1 className={css({ margin: 0, fontSize: "2xl", color: "gray.700" })}>利用申請</h1>
          <p className={css({ marginTop: 1, marginBottom: 0, color: "gray.500", fontSize: "sm" })}>
            管理者承認後に MaxiCloud を利用できます（現在はUIのみ）
          </p>
        </div>

        <form
          className={css({ display: "grid", gap: 3 })}
          onSubmit={(event) => {
            event.preventDefault();
            navigate("/login");
          }}
        >
          <Field label="表示名">
            <Input placeholder="例: Taro Maximum" />
          </Field>
          <Field label="学内メールアドレス">
            <Input placeholder="u123456@ac.saitama-u.ac.jp" />
          </Field>
          <Field label="GitHub ID">
            <Input placeholder="例: maximum-user" />
          </Field>
          <Field label="利用目的">
            <Textarea rows={4} placeholder="どのアプリをデプロイしたいか" />
          </Field>

          <Button type="submit" variant="primary">
            Request Access (Mock)
          </Button>
        </form>

        <p className={css({ margin: 0, color: "gray.500", fontSize: "sm" })}>
          既にアカウントがある場合は <Link to="/login">ログイン</Link>
        </p>
      </section>
    </div>
  );
}

const Field = ({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) => (
  <label className={css({ display: "grid", gap: 1 })}>
    <span className={css({ fontSize: "sm", fontWeight: 600, color: "gray.600" })}>{label}</span>
    {children}
  </label>
);
