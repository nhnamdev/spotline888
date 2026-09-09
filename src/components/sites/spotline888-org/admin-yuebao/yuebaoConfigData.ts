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

export const INITIAL_YUEBAO_CONFIGS: YuebaoConfigItem[] = [];

