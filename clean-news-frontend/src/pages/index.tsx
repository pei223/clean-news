import { useContext, useEffect, useState } from 'react'
import Layout from '../components/layout'
import {
  ArticleWithDisplayDisable,
  FilterAndSortCriteria,
  filterAndSortArticles,
} from '../domain/article'
import { ArticleRow } from '../components/articles/ArticleRow'
import { Box, Button, Divider, TablePagination, Typography } from '@mui/material'
import { FilterForm } from '../components/articles/FilterForm'
import { removeArticlesCache, useArticles } from '../stores/article'
import LoadingScreen from '../components/common/LoadingScreen'
import { AppContext } from '../stores/appContext'
import { usePaginatedData } from '../hooks/common/pagination'
import { useStateBySearchParams } from '../hooks/common/router'
import { useSearchParams } from 'react-router-dom'
import { removeUserCache, updateUserData, useUserData } from '../stores/user'
import { useSnackbar } from 'notistack'
import { DefaultUserData } from '../domain/user'

export const IndexPage = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { developperMode, user } = useContext(AppContext)
  const { data: sourceArticles, loading: articleLoading, mutate: mutateArticle } = useArticles()
  const {
    data: userData,
    loading: userDataLoading,
    mutate: mutateUserData,
  } = useUserData(user!.uid)
  const [searchParams, setSearchParams] = useSearchParams()

  const [page, updatePageSearchParams] = useStateBySearchParams<number>(searchParams, 'page', 1)
  const [countPerPage, updateCountPerPageSearchParams] = useStateBySearchParams<number>(
    searchParams,
    'countPerPage',
    10,
  )

  const [criteria, setCriteria] = useState<FilterAndSortCriteria>(userData || DefaultUserData)

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

  useEffect(() => {
    if (userData == null || criteria == null) {
      return
    }
    setCriteria({
      blockedArticleVisibility: userData.blockedArticleVisibility,
      filterTopics: userData.filterTopics,
      filterCarefulLabels: userData.filterCarefulLabels,
      sortKind: userData.sortKind,
    })
  }, [userData])

  const removeCachesAndRefetch = async () => {
    removeArticlesCache()
    await mutateArticle()
    removeUserCache()
    await mutateUserData()
  }

  const updateCriteria = async (criteria: FilterAndSortCriteria) => {
    setCriteria(criteria)
    try {
      await updateUserData(user!.uid, {
        ...criteria,
        // TODO 未実装なので空配列を入れておく
        freeKeywords: [],
      })
      // 永続化 & キャッシュ保存しており、stateも更新できているので
      // わざわざmutateする必要はない.
    } catch (e) {
      console.error(e)
      enqueueSnackbar({
        message: 'フィルタリング設定の更新に失敗しました',
        variant: 'error',
      })
    }
  }

  return (
    <Layout>
      {articleLoading || userDataLoading ? (
        <LoadingScreen />
      ) : (
        <Box
          sx={{
            marginTop: 2,
            marginBottom: '160px',
          }}
        >
          <Typography
            variant="h5"
            component="h1"
            sx={{
              marginBottom: 3,
            }}
          >
            ニュース記事一覧
          </Typography>
          {developperMode && (
            <Button onClick={removeCachesAndRefetch} variant="contained">
              Clear cache
            </Button>
          )}
          <FilterForm criteria={criteria} onCriteriaChange={updateCriteria} />
          <Box
            component="section"
            sx={{
              marginTop: 4,
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
