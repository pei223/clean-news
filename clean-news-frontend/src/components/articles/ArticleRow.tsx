import { Box, Chip, Typography } from "@mui/material";
import { Article } from "../../domain/article";
import { toDisplayDate } from "../../utils/dateUtil";
import { intersection } from "lodash";

type Props = {
  filterTopics: string[];
  filterCarefulLabels: string[];
  article: Article;
};
export const ArticleRow = ({
  filterTopics,
  filterCarefulLabels,
  article,
}: Props) => {
  const blocked =
    intersection(article.topics, filterTopics).length > 0 ||
    intersection(article.carefulLabels, filterCarefulLabels).length > 0;
  return (
    <Box
      component="a"
      href={article.url}
      target="_blank"
      sx={{
        margin: 2,
        display: "flex",
        flexDirection: "row",
        cursor: "pointer",
        textDecoration: "none",
        opacity: blocked ? 0.25 : 1,
      }}
    >
      <span>
        {article.thumbnailUrl ? (
          <Box
            component="img"
            src={article.thumbnailUrl || ""}
            sx={{
              borderRadius: "5%",
              width: "120px",
              "@media (max-width:960px)": {
                width: "75px",
              },
            }}
          />
        ) : (
          <Box
            sx={{
              borderRadius: "5%",
              width: "120px",
              height: "120px",
              background: "#F8F8F8",
              "@media (max-width:960px)": {
                width: "75px",
                height: "75px",
              },
            }}
          />
        )}
      </span>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
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
          <div>
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
          </div>
        </div>
      </Box>
    </Box>
  );
};
