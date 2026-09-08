export interface YuebaoConfigItem {
  id: number;
  title: string;
  radio: string;
  day: number;
  min_money: string;
  status: number; // 1: 启用, 0: 禁用
  creat_time: string;
  status_text?: string;
}

export const INITIAL_YUEBAO_CONFIGS: YuebaoConfigItem[] = [
  {
    id: 6,
    title: "5",
    radio: "1.00-1.21%",
    day: 5,
    min_money: "10000.00-50000",
    status: 1,
    creat_time: "2025-08-16 15:30:26",
    status_text: "启用"
  },
  {
    id: 5,
    title: "7",
    radio: "2.00-2.21%",
    day: 7,
    min_money: "50000.00-600000",
    status: 1,
    creat_time: "2025-08-16 15:29:48",
    status_text: "启用"
  },
  {
    id: 4,
    title: "10",
    radio: "3.00-3.21%",
    day: 10,
    min_money: "200000.00-900000.00",
    status: 1,
    creat_time: "2025-08-16 15:29:10",
    status_text: "启用"
  },
  {
    id: 3,
    title: "15",
    radio: "4.00-4.21%",
    day: 15,
    min_money: "500000.00-5000000.00",
    status: 1,
    creat_time: "2025-08-16 15:28:36",
    status_text: "启用"
  },
  {
    id: 1,
    title: "30",
    radio: "5.00-5.21%",
    day: 30,
    min_money: "10000.00-50000000.00",
    status: 1,
    creat_time: "2025-08-16 08:25:52",
    status_text: "启用"
  }
];
