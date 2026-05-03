import { Search } from "react-feather";
import { css } from "styled-system/css";
import { Button } from "~/components/ui/button";

type ProjectsToolbarProps = {
  keyword: string;
  onKeywordChange: (keyword: string) => void;
  onCreateProject: () => void;
};

export const ProjectsToolbar = ({
  keyword,
  onKeywordChange,
  onCreateProject,
}: ProjectsToolbarProps) => {
  return (
    <div
      className={css({
        display: "flex",
        gap: 2,
        alignItems: "center",
        marginBottom: 4,
      })}
    >
      <label
        className={css({
          flex: 1,
          display: "flex",
          alignItems: "center",
          gap: 2,
          border: "1px solid",
          borderColor: "gray.300",
          borderRadius: "md",
          background: "white",
          padding: "token(spacing.2) token(spacing.3)",
        })}
      >
        <Search size={14} />
        <input
          value={keyword}
          onChange={(event) => onKeywordChange(event.target.value)}
          type="text"
          placeholder="project / description / owner"
          className={css({
            border: "none",
            outline: "none",
            width: "100%",
            background: "transparent",
            fontSize: "sm",
          })}
        />
      </label>
      <Button type="button" variant="secondary" size="sm" onClick={onCreateProject}>
        New Project
      </Button>
    </div>
  );
};
