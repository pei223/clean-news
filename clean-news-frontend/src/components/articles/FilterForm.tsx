import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Checkbox,
  FormControl,
  Grid2,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import {
  BlockedArticleVisibility,
  FilterAndSortCriteria,
  SortKinds,
  validBlockedArticleVisibility,
  validSortKinds,
} from '../../domain/article'
import { blockedArticleVisibilityLabel, sortKindLabel } from './types'
import { Topics, carefulLabels } from '../../domain/parameters'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

type Props = {
  criteria: FilterAndSortCriteria
  onCriteriaChange: (v: FilterAndSortCriteria) => void
}

export const FilterForm = ({ criteria, onCriteriaChange }: Props) => {
  return (
    <div>
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography color="text.secondary" variant="body1">
            フィルター・ソート条件
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid2 container spacing={2}>
            <Grid2
              size={{
                xs: 12,
                sm: 3,
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="sort-order-label">ソート順</InputLabel>
                <Select
                  fullWidth
                  labelId="sort-order-label"
                  size="small"
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
              </FormControl>
            </Grid2>
            <Grid2
              size={{
                xs: 12,
                sm: 4,
              }}
            >
              <FormControl fullWidth>
                <InputLabel id="blocked-article-visibility-label">
                  ブロックされた記事の表示方法
                </InputLabel>
                <Select
                  fullWidth
                  labelId="blocked-article-visibility-label"
                  size="small"
                  value={criteria.blockedArticleVisibility}
                  onChange={(e) =>
                    onCriteriaChange({
                      ...criteria,
                      blockedArticleVisibility: e.target.value as BlockedArticleVisibility,
                    })
                  }
                >
                  {validBlockedArticleVisibility.map((v) => (
                    <MenuItem key={v} value={v}>
                      {blockedArticleVisibilityLabel[v]}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid2>
            <Grid2 size={12}>
              <Autocomplete
                multiple
                options={Topics}
                value={criteria.filterTopics}
                disableCloseOnSelect
                size="small"
                onChange={(_, newValue: string[]) => {
                  console.log(newValue)
                  onCriteriaChange({
                    ...criteria,
                    filterTopics: newValue,
                  })
                }}
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props
                  return (
                    <li key={key as string} {...optionProps}>
                      <Checkbox checked={selected} />
                      {option}
                    </li>
                  )
                }}
                renderInput={(params) => (
                  <div>
                    <TextField {...params} variant="outlined" label="ブロックするトピック" />
                  </div>
                )}
              />
            </Grid2>
            <Grid2 size={12}>
              <Autocomplete
                multiple
                options={carefulLabels}
                value={criteria.filterCarefulLabels}
                disableCloseOnSelect
                size="small"
                onChange={(_, newValue: string[]) => {
                  console.log(newValue)
                  onCriteriaChange({
                    ...criteria,
                    filterCarefulLabels: newValue,
                  })
                }}
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props
                  return (
                    <li key={key as string} {...optionProps}>
                      <Checkbox checked={selected} />
                      {option}
                    </li>
                  )
                }}
                renderInput={(params) => (
                  <div>
                    <TextField {...params} variant="outlined" label="ブロックする注意ラベル" />
                  </div>
                )}
              />
            </Grid2>
          </Grid2>
        </AccordionDetails>
      </Accordion>
    </div>
  )
}
