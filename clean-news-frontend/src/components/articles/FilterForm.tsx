import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Checkbox,
  Chip,
  Divider,
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
import { logger } from '../../utils/logger'

type Props = {
  criteria: FilterAndSortCriteria
  onCriteriaChange: (v: FilterAndSortCriteria) => void
}

const SelectAllLabel = '全て'

const isSelectedAllCarefulLabels = (v: string[]) =>
  v.filter((_v) => _v !== SelectAllLabel).length === carefulLabels.length

export const FilterForm = ({ criteria, onCriteriaChange }: Props) => {
  const handleSelectAllCarefulLabels = (newValue: string[]) => {
    const isSelectAllBeforeUpdate = isSelectedAllCarefulLabels(criteria.filterCarefulLabels)
    const removingSelectAll = isSelectAllBeforeUpdate && !newValue.includes(SelectAllLabel)
    const addingSelectAll = !isSelectAllBeforeUpdate && newValue.includes(SelectAllLabel)

    if (removingSelectAll) {
      onCriteriaChange({
        ...criteria,
        filterCarefulLabels: [],
      })
      return
    }
    if (addingSelectAll) {
      onCriteriaChange({
        ...criteria,
        filterCarefulLabels: carefulLabels,
      })
      return
    }

    onCriteriaChange({
      ...criteria,
      filterCarefulLabels: newValue.filter((v) => v !== SelectAllLabel),
    })
  }

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
                  logger.log(newValue)
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
                options={[SelectAllLabel].concat(carefulLabels)}
                value={
                  isSelectedAllCarefulLabels(criteria.filterCarefulLabels)
                    ? carefulLabels.concat([SelectAllLabel])
                    : criteria.filterCarefulLabels
                }
                disableCloseOnSelect
                onChange={(_, newValue: string[]) => {
                  handleSelectAllCarefulLabels(newValue)
                }}
                renderTags={(values, getTagProps) =>
                  values
                    .filter((v) => v !== SelectAllLabel)
                    .map((v, i) => <Chip size="small" {...getTagProps({ index: i })} label={v} />)
                }
                renderOption={(props, option, { selected }) => {
                  const { key, ...optionProps } = props
                  return (
                    <>
                      <li key={key as string} {...optionProps}>
                        <Checkbox checked={selected} />
                        {option}
                      </li>
                      {option === SelectAllLabel && <Divider />}
                    </>
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
