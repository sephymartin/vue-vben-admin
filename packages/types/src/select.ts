/**
 * Select 选项通用类型定义
 */
interface SelectOption<T = any> {
  label: string;
  value: T;
  disabled?: boolean;
  color?: string;
  [key: string]: any;
}

export type { SelectOption };
