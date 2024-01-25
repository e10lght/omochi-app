import dayjs, { Dayjs } from "dayjs";
import utc from "dayjs/plugin/utc";

export const isValidDate = (str: string) => {
  const date = new Date(str);
  return !isNaN(date.getTime());
};

dayjs.extend(utc);

// タイムゾーンがずれてるので対処療法
// 例えば下記のようになっている
// データ作成：データベース上に日本標準時-9した日付で登録
// データ取得：作成されたデータから更に-9した日付で取得
// dayjsでは現在時刻はutcで取得、なので作成されたデータと等価
export const setToFifteen = (date: Dayjs) => {
  // 与えられた日付が15時より前かどうかを確認
  if (date.hour() < 15) {
    // 15時より前の場合、前日の15時に設定
    date = date.subtract(1, "day").hour(15).minute(0).second(0).millisecond(0);
  } else {
    // 15時より後の場合、同日の15時に設定
    date = date.hour(15).minute(0).second(0).millisecond(0);
  }

  return date.toISOString();
};
