import { useContext, useEffect, useState } from 'react'
import Layout from '../components/layout'
import {
  ArticleWithDisplayDisable,
  FilterAndSortCriteria,
  filterAndSortArticles,
} from '../domain/article'
import { ArticleRow } from '../components/articles/ArticleRow'
import { Box, Button, Divider, TablePagination } from '@mui/material'
import { FilterForm } from '../components/articles/FilterForm'
import { removeArticlesCache, useArticles } from '../stores/article'
import LoadingScreen from '../components/common/LoadingScreen'
import { AppContext } from '../stores/appContext'
import { usePaginatedData } from '../hooks/common/pagination'
import { useStateBySearchParams } from '../hooks/common/router'
import { useSearchParams } from 'react-router-dom'

export const IndexPage = () => {
  const { developperMode } = useContext(AppContext)
  const { data: sourceArticles, loading, mutate } = useArticles()
  const [searchParams, setSearchParams] = useSearchParams()

  const [page, updatePageSearchParams] = useStateBySearchParams<number>(searchParams, 'page', 1)
  const [countPerPage, updateCountPerPageSearchParams] = useStateBySearchParams<number>(
    searchParams,
    'countPerPage',
    10,
  )

  const [criteria, setCriteria] = useState<FilterAndSortCriteria>({
    blockedArticleVisibility: 'remove',
    filterTopics: ['芸能', 'トレンド'],
    filterCarefulLabels: ['死去', '暴力', '不祥事'],
    sortKind: 'created-at-desc',
  })

  const [articles, setArticles] = useState<ArticleWithDisplayDisable[]>([])

  const paginatedData = usePaginatedData(articles, page, countPerPage)

  useEffect(() => {
    if (sourceArticles == null) {
      return
    }
    const newSearchParams = updatePageSearchParams(searchParams, 1)
    setSearchParams(newSearchParams)
    const filteredArticles = filterAndSortArticles(sourceArticles, criteria)
    setArticles(filteredArticles)
  }, [sourceArticles, criteria])

  return (
    <Layout>
      {loading ? (
        <LoadingScreen />
      ) : (
        <Box
          sx={{
            marginTop: 2,
            marginBottom: '160px',
          }}
        >
          {developperMode && (
            <Button
              onClick={() => {
                removeArticlesCache()
                mutate()
              }}
              variant="contained"
            >
              Clear cache
            </Button>
          )}
          <FilterForm criteria={criteria} onCriteriaChange={(v) => setCriteria(v)} />
          <Box
            component="section"
            sx={{
              marginBottom: 4,
            }}
          >
            {paginatedData.map((v) => (
              <div key={v.articleId}>
                <ArticleRow article={v} showPredictionVersion={developperMode} />
                <Divider />
              </div>
            ))}
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
            }}
          >
            <TablePagination
              component="div"
              page={page - 1}
              onPageChange={(_, page) => {
                const newSearchParams = updatePageSearchParams(searchParams, page + 1)
                setSearchParams(newSearchParams)
              }}
              rowsPerPage={countPerPage}
              onRowsPerPageChange={(e) => {
                const newSearchParams = updateCountPerPageSearchParams(
                  updatePageSearchParams(searchParams, 1),
                  Number(e.target.value),
                )
                setSearchParams(newSearchParams)
              }}
              count={articles.length}
              rowsPerPageOptions={[5, 10, 20, 50]}
            />
          </Box>
        </Box>
      )}
    </Layout>
  )
}
