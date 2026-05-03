import { css } from "styled-system/css";
import { Button } from "~/components/ui/button";

type ActionRowProps = {
  isPending: boolean;
  canSubmit: boolean;
};

export const ActionRow = ({ isPending, canSubmit }: ActionRowProps) => (
  <div
    className={css({
      borderTop: "1px solid",
      borderTopColor: "gray.100",
      paddingTop: 4,
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      gap: 2,
      mdDown: { display: "grid" },
    })}
  >
    <p className={css({ margin: 0, color: "gray.500", fontSize: "sm" })}>
      入力内容は作成時にそのまま反映されます
    </p>
    <Button type="submit" variant="primary" disabled={isPending || !canSubmit}>
      {isPending ? "Creating..." : "Create Application"}
    </Button>
  </div>
);
