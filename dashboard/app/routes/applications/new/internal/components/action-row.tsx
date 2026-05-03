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
      justifyContent: "center",
      alignItems: "center",
      gap: 2,
      mdDown: { display: "grid", justifyContent: "stretch" },
    })}
  >
    <Button type="submit" variant="primary" disabled={isPending || !canSubmit}>
      {isPending ? "Creating..." : "Create Application"}
    </Button>
  </div>
);
