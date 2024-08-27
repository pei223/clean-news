import { Timestamp } from "firebase/firestore";
import dayjs from "dayjs";
import ja from "dayjs/locale/ja";

export function toDisplayDate(timestamp: Timestamp): string {
  return dayjs(timestamp.toDate()).locale(ja).format("YYYY年 MM月DD日 HH:mm");
}
