export interface RuleItem {
  id: number;
  type?: string;
  pid: number;
  name: string;
  title: string;
  icon: string;
  condition: string;
  remark: string;
  ismenu: number;
  createtime?: number | null;
  updatetime?: number | null;
  weigh: number;
  status: "normal" | "hidden";
  subnode?: number;
  is_agent_menu?: number;
  spacer?: string;
  haschild?: number;
}

export const INITIAL_RULES: RuleItem[] = [];
