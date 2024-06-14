import { type MouseEvent, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import {
  type MRT_Cell,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { getCommonTooltipProps } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Button, ButtonProps } from '@blueprintjs/core';

export interface MRT_CopyButtonProps<TData extends MRT_RowData>
  extends ButtonProps {
  cell: MRT_Cell<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_CopyButton = <TData extends MRT_RowData>({
  cell,
  table,
  ...rest
}: MRT_CopyButtonProps<TData>) => {
  const {
    options: { localization, muiCopyButtonProps },
  } = table;
  const { column, row } = cell;
  const { columnDef } = column;

  const [copied, setCopied] = useState(false);

  const handleCopy = (event: MouseEvent, text: unknown) => {
    event.stopPropagation();
    navigator.clipboard.writeText(text as string);
    setCopied(true);
    setTimeout(() => setCopied(false), 4000);
  };

  const buttonProps = {
    ...parseFromValuesOrFunc(muiCopyButtonProps, {
      cell,
      column,
      row,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.muiCopyButtonProps, {
      cell,
      column,
      row,
      table,
    }),
    ...rest,
  };

  return (
    <Tooltip
      {...getCommonTooltipProps('top')}
      title={
        buttonProps?.title ??
        (copied ? localization.copiedToClipboard : localization.clickToCopy)
      }
    >
      <Button
        minimal
        onClick={((e) => handleCopy(e, cell.getValue())) as any}
        size="small"
        type="button"
        variant="text"
        {...buttonProps}
        css={(theme: any) => ({
          backgroundColor: 'transparent',
          border: 'none',
          color: 'inherit',
          cursor: 'copy',
          fontFamily: 'inherit',
          fontSize: 'inherit',
          letterSpacing: 'inherit',
          margin: '-0.25rem',
          minWidth: 'unset',
          paddingTop: 0,
          paddingBottom: 0,
          textAlign: 'inherit',
          textTransform: 'inherit',
          ...(parseFromValuesOrFunc(buttonProps?.sx, theme) as any),
        })}
        title={undefined}
      />
    </Tooltip>
  );
};
