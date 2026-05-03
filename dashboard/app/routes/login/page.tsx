import { useNavigate } from "react-router";
import { css } from "styled-system/css";
import { Button } from "~/components/ui/button";
import { APP_NAME, APP_ROUTES } from "~/constant";
import { Panel } from "~/components/ui/panel";

export default function LoginPage() {
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
      <div
        className={css({
          width: "100%",
          maxWidth: "520px",
        })}
      >
        <Panel>
        <div>
          <h1 className={css({ margin: 0, fontSize: "2xl", color: "gray.700" })}>{APP_NAME}</h1>
          <p className={css({ marginTop: 1, marginBottom: 0, color: "gray.500", fontSize: "sm" })}>
            認証は OIDC 連携に置き換える前提です。現時点ではログイン機能は使いません。
          </p>
        </div>
        <div className={css({ display: "flex", gap: 2, marginTop: 2 })}>
          <Button type="button" variant="primary" onClick={() => navigate(APP_ROUTES.home)}>
            Go to Dashboard
          </Button>
        </div>
        </Panel>
      </div>
    </div>
  );
}
