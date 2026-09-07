import "react";

declare module "react" {
  interface AnchorHTMLAttributes<T> extends HTMLAttributes<T> {
    addtabs?: string | number;
    url?: string;
    py?: string;
    pinyin?: string;
  }
}
