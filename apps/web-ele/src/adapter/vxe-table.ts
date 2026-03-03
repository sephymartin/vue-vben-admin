import type { VxeTableGridOptions } from '@vben/plugins/vxe-table';
import type { Recordable } from '@vben/types';

import { h } from 'vue';

import { IconifyIcon } from '@vben/icons';
import { $te } from '@vben/locales';
import {
  setupVbenVxeTable,
  useVbenVxeGrid as useGrid,
} from '@vben/plugins/vxe-table';
import { get, isFunction, isString } from '@vben/utils';

import { objectOmit } from '@vueuse/core';
import {
  ElButton,
  ElImage,
  ElPopconfirm,
  ElSwitch,
  ElTag,
  ElTooltip,
} from 'element-plus';

import { $t } from '#/locales';

import { useVbenForm } from './form';

setupVbenVxeTable({
  configVxeTable: (vxeUI) => {
    vxeUI.setConfig({
      grid: {
        align: 'left',
        border: false,
        columnConfig: {
          resizable: true,
        },
        minHeight: 180,
        formConfig: {
          // 全局禁用vxe-table的表单配置，使用formOptions
          enabled: false,
        },
        proxyConfig: {
          autoLoad: true,
          response: {
            result: 'items',
            total: 'total',
            list: 'items',
          },
          showActiveMsg: true,
          showResponseMsg: false,
        },
        round: true,
        showOverflow: true,
        size: 'small',
      } as VxeTableGridOptions,
    });

    // 表格配置项可以用 cellRender: { name: 'CellImage' },
    vxeUI.renderer.add('CellImage', {
      renderTableDefault(renderOpts, params) {
        const { props } = renderOpts;
        const { column, row } = params;
        const src = row[column.field];
        return h(ElImage, { src, previewSrcList: [src], ...props });
      },
    });

    // 表格配置项可以用 cellRender: { name: 'CellLink' },
    vxeUI.renderer.add('CellLink', {
      renderTableDefault(renderOpts) {
        const { props } = renderOpts;
        return h(
          ElButton,
          { size: 'small', link: true },
          { default: () => props?.text },
        );
      },
    });

    // 单元格渲染： Tag
    vxeUI.renderer.add('CellTag', {
      renderTableDefault({ options, props }, { column, row }) {
        const value = get(row, column.field);
        const tagOptions = options ?? [
          { type: 'success', label: $t('common.enabled'), value: true },
          { type: 'info', label: $t('common.disabled'), value: false },
        ];
        const tagItem = tagOptions.find((item) => item.value === value);
        return h(
          ElTag,
          {
            ...props,
            ...objectOmit(tagItem ?? {}, ['label']),
          },
          { default: () => tagItem?.label ?? value },
        );
      },
    });

    // 单元格渲染： Switch
    vxeUI.renderer.add('CellSwitch', {
      renderTableDefault({ attrs, props }, { column, row }) {
        const loadingKey = `__loading_${column.field}`;
        const checkedValue = attrs?.checkedValue ?? true;
        const uncheckedValue = attrs?.uncheckedValue ?? false;
        const currentValue = row[column.field];

        // 将数据值转换为 ElSwitch 需要的布尔值
        const getBooleanValue = (value: any) => {
          if (checkedValue !== undefined && uncheckedValue !== undefined) {
            return value === checkedValue;
          }
          return Boolean(value);
        };

        // 将布尔值转换回数据值
        const getDataValue = (boolValue: boolean) => {
          if (checkedValue !== undefined && uncheckedValue !== undefined) {
            return boolValue ? checkedValue : uncheckedValue;
          }
          return boolValue;
        };

        const isEnabled = getBooleanValue(currentValue);
        const tooltipText = isEnabled
          ? $t('common.enabled')
          : $t('common.disabled');

        const finallyProps = {
          activeText: '',
          inactiveText: '',
          ...props,
          modelValue: isEnabled,
          loading: row[loadingKey] ?? false,
          'onUpdate:modelValue': onChange,
        };
        async function onChange(newBoolVal: boolean) {
          const newDataValue = getDataValue(newBoolVal);
          row[loadingKey] = true;
          try {
            const result = await attrs?.beforeChange?.(newDataValue, row);
            if (result !== false) {
              row[column.field] = newDataValue;
            }
          } finally {
            row[loadingKey] = false;
          }
        }

        const switchComponent = h(ElSwitch, finallyProps);

        // 如果 props 中设置了隐藏文字，则添加 tooltip
        if (props?.activeText === '' || props?.inactiveText === '') {
          return h(
            ElTooltip,
            {
              content: tooltipText,
              placement: 'top',
            },
            {
              default: () => switchComponent,
            },
          );
        }

        return switchComponent;
      },
    });

    /**
     * 注册表格的操作按钮渲染器
     */
    vxeUI.renderer.add('CellOperation', {
      renderTableDefault({ attrs, options, props }, { column, row }) {
        const defaultProps = { size: 'small', link: true, ...props };
        let align = 'flex-end';
        switch (column.align) {
          case 'center': {
            align = 'center';
            break;
          }
          case 'left': {
            align = 'flex-start';
            break;
          }
          default: {
            align = 'flex-end';
            break;
          }
        }
        const presets: Recordable<Recordable<any>> = {
          delete: {
            type: 'danger',
            text: $t('common.delete'),
          },
          edit: {
            text: $t('common.edit'),
          },
        };
        const operations: Array<Recordable<any>> = (
          options || ['edit', 'delete']
        )
          .map((opt) => {
            if (isString(opt)) {
              return presets[opt]
                ? { code: opt, ...presets[opt], ...defaultProps }
                : {
                    code: opt,
                    text: $te(`common.${opt}`) ? $t(`common.${opt}`) : opt,
                    ...defaultProps,
                  };
            } else {
              return { ...defaultProps, ...presets[opt.code], ...opt };
            }
          })
          .map((opt) => {
            const optBtn: Recordable<any> = {};
            Object.keys(opt).forEach((key) => {
              optBtn[key] = isFunction(opt[key]) ? opt[key](row) : opt[key];
            });
            return optBtn;
          })
          .filter((opt) => opt.show !== false);

        function renderBtn(opt: Recordable<any>, listen = true) {
          return h(
            ElButton,
            {
              ...props,
              ...opt,
              onClick: listen
                ? () =>
                    attrs?.onClick?.({
                      code: opt.code,
                      row,
                    })
                : undefined,
            },
            {
              default: () => {
                const content = [];
                if (opt.icon) {
                  content.push(
                    h(IconifyIcon, { class: 'size-5', icon: opt.icon }),
                  );
                }
                content.push(opt.text);
                return content;
              },
            },
          );
        }

        function renderConfirm(opt: Recordable<any>) {
          return h(
            ElPopconfirm,
            {
              title: $t('ui.actionMessage.deleteConfirm', [
                row[attrs?.nameField || 'name'],
              ]),
              confirmButtonText: $t('common.confirm'),
              cancelButtonText: $t('common.cancel'),
              onConfirm: () => {
                attrs?.onClick?.({
                  code: opt.code,
                  row,
                });
              },
            },
            {
              default: () => renderBtn({ ...opt }, false),
            },
          );
        }

        const btns = operations.map((opt) =>
          opt.code === 'delete' ? renderConfirm(opt) : renderBtn(opt),
        );
        return h(
          'div',
          {
            class: 'flex table-operations',
            style: { justifyContent: align },
          },
          btns,
        );
      },
    });

    // 这里可以自行扩展 vxe-table 的全局配置，比如自定义格式化
    // vxeUI.formats.add
  },
  useVbenForm,
});

export const useVbenVxeGrid = <T extends Record<string, any>>(
  ...rest: Parameters<typeof useGrid<T>>
) => useGrid<T>(...rest);

export type OnActionClickParams<T = Recordable<any>> = {
  code: string;
  row: T;
};
export type OnActionClickFn<T = Recordable<any>> = (
  params: OnActionClickParams<T>,
) => void;

/**
 * 列对齐类型
 */
export type ColumnAlignType = 'center' | 'left' | 'right';

/**
 * 字段类型到对齐方式的映射
 * 用于根据字段名自动设置列的对齐方式
 */
const FIELD_ALIGN_MAP: Record<string, ColumnAlignType> = {
  // 金额类型字段（可根据实际字段名扩展）
  amount: 'right',
  price: 'right',
  total: 'right',
  balance: 'right',
  // 数字类型字段
  sortOrder: 'right',
  order: 'right',
  // 操作列
  operation: 'center',
};

/**
 * 根据字段名获取列的对齐方式
 * @param field 字段名
 * @returns 对齐方式，默认为 'left'
 * @example
 * ```typescript
 * {
 *   field: 'amount',
 *   title: '金额',
 *   align: getColumnAlign('amount'), // 返回 'right'
 * }
 * ```
 */
export function getColumnAlign(field: string): ColumnAlignType {
  return FIELD_ALIGN_MAP[field] || 'left';
}

export type * from '@vben/plugins/vxe-table';
