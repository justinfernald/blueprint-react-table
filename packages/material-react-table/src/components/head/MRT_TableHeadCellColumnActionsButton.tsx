import { type MouseEvent, useState } from 'react';
import Tooltip from '@mui/material/Tooltip';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { getCommonTooltipProps } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_ColumnActionMenu } from '../menus/MRT_ColumnActionMenu';
import { Button, ButtonProps, Icon } from '@blueprintjs/core';

export interface MRT_TableHeadCellColumnActionsButtonProps<
  TData extends MRT_RowData,
> extends ButtonProps {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCellColumnActionsButton = <
  TData extends MRT_RowData,
>({
  header,
  table,
  ...rest
}: MRT_TableHeadCellColumnActionsButtonProps<TData>) => {
  const {
    options: { localization, muiColumnActionsButtonProps },
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const [isOpen, setIsOpen] = useState(false);

  const iconButtonProps = {
    ...parseFromValuesOrFunc(muiColumnActionsButtonProps, {
      column,
      table,
    }),
    ...parseFromValuesOrFunc(columnDef.muiColumnActionsButtonProps, {
      column,
      table,
    }),
    ...rest,
  };

  return (
    <>
      <Tooltip
        {...getCommonTooltipProps('top')}
        title={iconButtonProps?.title ?? localization.columnActions}
      >
        <MRT_ColumnActionMenu
          onClick={() => setIsOpen((v) => !v)}
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          header={header}
          table={table}
        />
      </Tooltip>
    </>
  );
};
