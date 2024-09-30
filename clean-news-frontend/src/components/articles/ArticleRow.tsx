import { Box, Chip, Typography } from '@mui/material'
import { ArticleWithDisplayDisable } from '../../domain/article'
import { toDisplayDate } from '../../utils/dateUtil'

type Props = {
  article: ArticleWithDisplayDisable
  showPredictionVersion?: boolean
}
export const ArticleRow = ({ article, showPredictionVersion = false }: Props) => {
  return (
    <Box
      component="a"
      href={article.url}
      target="_blank"
      sx={{
        margin: 2,
        display: 'flex',
        flexDirection: 'row',
        cursor: 'pointer',
        textDecoration: 'none',
        opacity: article.displayDisabled ? 0.25 : 1,
      }}
    >
      <span>
        {article.thumbnailUrl ? (
          <Box
            component="img"
            src={article.thumbnailUrl || ''}
            sx={{
              borderRadius: '5%',
              width: '120px',
              '@media (max-width:960px)': {
                width: '75px',
              },
            }}
          />
        ) : (
          <Box
            sx={{
              borderRadius: '5%',
              width: '120px',
              height: '120px',
              background: '#F8F8F8',
              '@media (max-width:960px)': {
                width: '75px',
                height: '75px',
              },
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              color: '#AAA',
            }}
          >
            no image
          </Box>
        )}
      </span>
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingY: 1,
          paddingX: 2,
        }}
      >
        <div>
          <Typography color="text.secondary" variant="body1">
            {article.title}
          </Typography>
          <Typography color="text.secondary" variant="body2" paddingTop={1}>
            {article.summary}
          </Typography>
        </div>
        <div>
          <Typography color="text.secondary" variant="caption" paddingTop={2}>
            {toDisplayDate(article.createdAt)}
          </Typography>
        </div>
        <div>
          {article.topics.map((v) => (
            <Chip
              key={v}
              sx={{
                paddingX: 1,
                marginRight: 1,
              }}
              label={v}
              size="small"
              variant="filled"
              color="default"
            />
          ))}
          {article.carefulLabels.map((v) => (
            <Chip
              key={v}
              sx={{
                paddingX: 1,
                marginRight: 1,
              }}
              label={v}
              size="small"
              variant="filled"
              color="error"
            />
          ))}
          {showPredictionVersion && (
            <div>
              <Chip
                sx={{
                  paddingX: 1,
                  marginRight: 1,
                }}
                label={article.version}
                size="small"
                variant="filled"
              />
            </div>
          )}
        </div>
      </Box>
    </Box>
  )
}
