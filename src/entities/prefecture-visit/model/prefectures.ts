export type Prefecture = {
  code: number;
  name: string;
  mapKey: string;
};

export const PREFECTURES = [
  { code: 1, name: "北海道", mapKey: "Hokkaido\x8d" },
  { code: 2, name: "青森県", mapKey: "Aomori" },
  { code: 3, name: "岩手県", mapKey: "Iwate" },
  { code: 4, name: "宮城県", mapKey: "Miyagi" },
  { code: 5, name: "秋田県", mapKey: "Akita" },
  { code: 6, name: "山形県", mapKey: "Yamagata" },
  { code: 7, name: "福島県", mapKey: "Fukushima" },
  { code: 8, name: "茨城県", mapKey: "Ibaraki" },
  { code: 9, name: "栃木県", mapKey: "Tochigi" },
  { code: 10, name: "群馬県", mapKey: "Gunma" },
  { code: 11, name: "埼玉県", mapKey: "Saitama" },
  { code: 12, name: "千葉県", mapKey: "Chiba" },
  { code: 13, name: "東京都", mapKey: "Tokyo" },
  { code: 14, name: "神奈川県", mapKey: "Kanagawa" },
  { code: 15, name: "新潟県", mapKey: "Niigata" },
  { code: 16, name: "富山県", mapKey: "Toyama" },
  { code: 17, name: "石川県", mapKey: "Ishikawa" },
  { code: 18, name: "福井県", mapKey: "Fukui" },
  { code: 19, name: "山梨県", mapKey: "Yamanashi" },
  { code: 20, name: "長野県", mapKey: "Nagano" },
  { code: 21, name: "岐阜県", mapKey: "Gifu" },
  { code: 22, name: "静岡県", mapKey: "Shizuoka" },
  { code: 23, name: "愛知県", mapKey: "Aichi" },
  { code: 24, name: "三重県", mapKey: "Mie" },
  { code: 25, name: "滋賀県", mapKey: "Shiga" },
  { code: 26, name: "京都府", mapKey: "Kyoto" },
  { code: 27, name: "大阪府", mapKey: "Osaka" },
  { code: 28, name: "兵庫県", mapKey: "Hyogo" },
  { code: 29, name: "奈良県", mapKey: "Nara" },
  { code: 30, name: "和歌山県", mapKey: "Wakayama" },
  { code: 31, name: "鳥取県", mapKey: "Tottori" },
  { code: 32, name: "島根県", mapKey: "Shimane" },
  { code: 33, name: "岡山県", mapKey: "Okayama" },
  { code: 34, name: "広島県", mapKey: "Hiroshima" },
  { code: 35, name: "山口県", mapKey: "Yamaguchi" },
  { code: 36, name: "徳島県", mapKey: "Tokushima" },
  { code: 37, name: "香川県", mapKey: "Kagawa" },
  { code: 38, name: "愛媛県", mapKey: "Ehime" },
  { code: 39, name: "高知県", mapKey: "Kochi" },
  { code: 40, name: "福岡県", mapKey: "Fukuoka" },
  { code: 41, name: "佐賀県", mapKey: "Saga" },
  { code: 42, name: "長崎県", mapKey: "Nagasaki" },
  { code: 43, name: "熊本県", mapKey: "Kumamoto" },
  { code: 44, name: "大分県", mapKey: "Oita" },
  { code: 45, name: "宮崎県", mapKey: "Miyazaki" },
  { code: 46, name: "鹿児島県", mapKey: "Kagoshima" },
  { code: 47, name: "沖縄県", mapKey: "Okinawa" },
] as const satisfies readonly Prefecture[];

export function getPrefectureByCode(code: number) {
  return PREFECTURES.find((prefecture) => prefecture.code === code);
}
