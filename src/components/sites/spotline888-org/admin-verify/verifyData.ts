export interface VerifyItem {
  id: number;
  username: string;
  real_name: string;
  id_card: string;
  profession: string;
  id_img_1: string;
  id_img_2: string;
  gj: string | null;
  is_auth: number; // 0: 未认证, 1: 已提交, 2: 已认证, -1: 认证失败
  id_auth_error: string;
  verify_time: string;
  reg_time: string;
  money: string;
  credit_score: number;
}
