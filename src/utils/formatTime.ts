import formatDistanceStrict from "date-fns/formatDistanceStrict"
import { ja } from "date-fns/locale"

export const formatTimeToNow = (time: number) =>
  formatDistanceStrict(time, new Date(), { locale: ja, addSuffix: true })
