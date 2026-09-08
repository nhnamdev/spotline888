export interface YuebaoOrderItem {
  share_id: number;
  user_id: number;
  username: string;
  amount: string;
  create_time: string;
}

export const INITIAL_YUEBAO_ORDERS: YuebaoOrderItem[] = [
  {
    share_id: 4,
    user_id: 12,
    username: "ak111",
    amount: "23.00",
    create_time: "2026-09-05 08:28:00"
  },
  {
    share_id: 3,
    user_id: 196,
    username: "WongLeeChu",
    amount: "5000.00",
    create_time: "2026-09-04 14:15:30"
  },
  {
    share_id: 2,
    user_id: 194,
    username: "CHOOILAIMEI",
    amount: "12000.00",
    create_time: "2026-09-03 11:20:15"
  },
  {
    share_id: 1,
    user_id: 192,
    username: "KHORHANKIONG",
    amount: "800.00",
    create_time: "2026-09-01 09:10:00"
  }
];
