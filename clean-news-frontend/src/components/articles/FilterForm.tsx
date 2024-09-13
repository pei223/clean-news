import { MenuItem, Select } from "@mui/material";
import {
  FilterAndSortCriteria,
  SortKinds,
  validSortKinds,
} from "../../domain/article";
import { sortKindLabel } from "./types";

type Props = {
  criteria: FilterAndSortCriteria;
  onCriteriaChange: (v: FilterAndSortCriteria) => void;
};

export const FilterForm = ({ criteria, onCriteriaChange }: Props) => {
  return (
    <div>
      <Select
        value={criteria.sortKind}
        onChange={(e) =>
          onCriteriaChange({
            ...criteria,
            sortKind: e.target.value as SortKinds,
          })
        }
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
