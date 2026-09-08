export interface IpWhitelistItem {
  id: number;
  ip: string;
  remark: string;
  status: number; // 1: 启用, 0: 禁用
  create_time: string;
  update_time?: string;
}

export const INITIAL_IP_WHITELIST: IpWhitelistItem[] = [
  {
    id: 2,
    ip: "77.83.241.39",
    remark: "我的",
    status: 1,
    create_time: "2026-02-23 20:53:10",
    update_time: "2026-02-23 20:53:10"
  },
  {
    id: 1,
    ip: "*.*.*.*",
    remark: "管理员IP",
    status: 1,
    create_time: "2026-02-23 12:22:22",
    update_time: "2026-02-23 20:49:48"
  }
];
