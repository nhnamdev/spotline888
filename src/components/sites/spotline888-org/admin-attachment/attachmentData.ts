import { getR2Url } from "@/lib/r2";

export interface AttachmentItem {
  id: number;
  admin_id: number;
  user_id: string;
  url: string;
  imagewidth: string;
  imageheight: string;
  imagetype: string;
  imageframes: number;
  filesize: number;
  mimetype: string;
  extparam: string;
  createtime: number;
  updatetime: number;
  uploadtime: number;
  storage: string;
  sha1: string;
  fullurl: string;
}

export const rawAttachments: AttachmentItem[] = [];
export const INITIAL_ATTACHMENTS: AttachmentItem[] = [];
