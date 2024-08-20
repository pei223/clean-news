def is_like_empty(v: str) -> bool:
    return v == "" or "空文字" in v or v == "''" or v == '""' or "empty" in v


def filter_like_empty(values: list[str]) -> list[str]:
    return [v for v in values if is_like_empty(v)]


def filter_by_candidates(values: list[str], candidates: list[str]) -> list[str]:
    return [v for v in values if v in candidates]
