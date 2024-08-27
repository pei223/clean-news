import { MenuItem, Select } from "@mui/material";
import { SortKinds, validSortKinds } from "../../domain/article";
import { sortKindLabel } from "./types";

type Props = {
  sortKind: SortKinds;
  onSortKindChange: (v: SortKinds) => void;
};

export const FilterForm = ({ sortKind, onSortKindChange }: Props) => {
  return (
    <div>
      <Select
        value={sortKind}
        onChange={(e) => onSortKindChange(e.target.value as SortKinds)}
      >
        {validSortKinds.map((v) => (
          <MenuItem key={v} value={v}>
            {sortKindLabel[v]}
          </MenuItem>
        ))}
      </Select>
    </div>
  );
};
