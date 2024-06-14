import { type DragEventHandler } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { getCommonTooltipProps } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Button, ButtonProps } from '@blueprintjs/core';

export interface MRT_GrabHandleButtonProps<TData extends MRT_RowData>
  extends ButtonProps {
  iconButtonProps?: ButtonProps;
  location?: 'column' | 'row';
  onDragEnd: DragEventHandler<HTMLButtonElement>;
  onDragStart: DragEventHandler<HTMLButtonElement>;
  table: MRT_TableInstance<TData>;
}

export const MRT_GrabHandleButton = <TData extends MRT_RowData>({
  location,
  table,
  ...rest
}: MRT_GrabHandleButtonProps<TData>) => {
  const {
    options: {
      icons: { DragHandleIcon },
      localization,
    },
  } = table;

  return (
    <Tooltip
      {...getCommonTooltipProps('top')}
      title={rest?.title ?? localization.move}
    >
      <Button
        minimal
        icon={'drag-handle-vertical'}
        aria-label={rest.title ?? localization.move}
        draggable="true"
        {...rest}
        onClick={(e) => {
          e.stopPropagation();
          rest?.onClick?.(e);
        }}
        css={(theme: any) => ({
          '&:active': {
            cursor: 'grabbing',
          },
          '&:hover': {
            backgroundColor: 'transparent',
            opacity: 1,
          },
          cursor: 'grab',
          margin: '0 -0.1rem',
          opacity: location === 'row' ? 1 : 0.5,
          padding: '2px',
          transition: 'all 150ms ease-in-out',
          ...(parseFromValuesOrFunc(rest?.css, theme) as any),
        })}
        title={undefined}
      />
    </Tooltip>
  );
};
