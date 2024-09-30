import dayjs from 'dayjs'
import ja from 'dayjs/locale/ja'

export function toDisplayDate(date: Date): string {
  return dayjs(date).locale(ja).format('YYYY年 MM月DD日 HH:mm')
}
