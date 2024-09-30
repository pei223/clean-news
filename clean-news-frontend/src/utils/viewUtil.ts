export function calcMaxPages(total: number, countPerPage: number): number {
  return Math.ceil(total / countPerPage)
}
