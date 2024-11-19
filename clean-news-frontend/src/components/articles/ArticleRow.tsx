import { Box, Chip, Typography } from '@mui/material'
import { ArticleWithDisplayDisable } from '../../domain/article'
import { toDisplayDate } from '../../utils/dateUtil'
import { useState } from 'react'

type Props = {
  article: ArticleWithDisplayDisable
  showPredictionVersion?: boolean
}
export const ArticleRow = ({ article, showPredictionVersion = false }: Props) => {
  const [isThumbnailError, setThumbnailError] = useState(false)

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
        {article.thumbnailUrl && !isThumbnailError ? (
          <Box
            component="img"
            src={article.thumbnailUrl || ''}
            sx={{
              borderRadius: '5%',
              width: '100px',
              '@media (max-width:960px)': {
                width: '75px',
              },
            }}
            onError={() => setThumbnailError(true)}
          />
        ) : (
          <Box
            sx={{
              borderRadius: '5%',
              width: '100px',
              height: '100px',
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
          paddingX: 2,
        }}
      >
        <div>
          <Typography color="text.primary" variant="body1">
            {article.title}
          </Typography>
          <Typography color="text.secondary" variant="subtitle2">
            {article.summary}
          </Typography>
          <Typography
            sx={{
              color: '#ACACAC',
            }}
            variant="caption"
            component="p"
          >
            {toDisplayDate(article.createdAt)}
          </Typography>
        </div>
        <div>
          {article.topics.map((v) => (
            <Chip
              key={v}
              sx={{
                height: '22px',
                paddingX: 0.5,
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
                height: '22px',
                paddingX: 0.5,
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
