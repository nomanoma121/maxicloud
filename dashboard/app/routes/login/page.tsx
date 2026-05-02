import { useEffect, useState } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { css } from "styled-system/css";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/form-controls";
import { useSession } from "~/hooks/use-session";
import { useLoginUsers } from "~/routes/login/internal/hooks/use-login-users";

export default function LoginPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isReady, isLoggedIn, loginAs } = useSession();
  const { users } = useLoginUsers();

  const [email, setEmail] = useState("kouta@maximum.vc");
  const [password, setPassword] = useState("********");

  const redirectTo = searchParams.get("redirect_to") || "/";
  const activeUsers = users.filter((user) => user.status === "active");

  useEffect(() => {
    if (isReady && isLoggedIn) {
      navigate(redirectTo);
    }
  }, [isReady, isLoggedIn, navigate, redirectTo]);

  if (!isReady || isLoggedIn) {
    return null;
  }

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
          maxWidth: "520px",
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
          <h1 className={css({ margin: 0, fontSize: "2xl", color: "gray.700" })}>MaxiCloud</h1>
          <p className={css({ marginTop: 1, marginBottom: 0, color: "gray.500", fontSize: "sm" })}>
            サークル内のデプロイ管理ダッシュボード
          </p>
        </div>

        <form
          className={css({ display: "grid", gap: 3 })}
          onSubmit={(event) => {
            event.preventDefault();
            const firstUser = activeUsers[0];
            if (!firstUser) return;
            loginAs(firstUser.id);
            navigate(redirectTo);
          }}
        >
          <label className={css({ display: "grid", gap: 1 })}>
            <span className={css({ fontSize: "sm", fontWeight: 600, color: "gray.600" })}>Email</span>
            <Input
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>

          <label className={css({ display: "grid", gap: 1 })}>
            <span className={css({ fontSize: "sm", fontWeight: 600, color: "gray.600" })}>Password</span>
            <Input
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              type="password"
            />
          </label>

          <Button type="submit" variant="primary" disabled={activeUsers.length === 0}>
            Sign In (Mock)
          </Button>
        </form>

        <div className={css({ display: "grid", gap: 2 })}>
          <p className={css({ margin: 0, color: "gray.500", fontSize: "xs" })}>Demo login</p>
          <div className={css({ display: "flex", gap: 2, smDown: { flexDirection: "column" } })}>
            {activeUsers
              .slice(0, 3)
              .map((user) => (
                <Button
                  key={user.id}
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => {
                    loginAs(user.id);
                    navigate(redirectTo);
                  }}
                >
                  Login as {user.displayName}
                </Button>
              ))}
          </div>
        </div>

        <p className={css({ margin: 0, color: "gray.500", fontSize: "sm" })}>
          初めて使う場合は <Link to="/register">利用申請</Link> を行ってください
        </p>
      </section>
    </div>
  );
}
