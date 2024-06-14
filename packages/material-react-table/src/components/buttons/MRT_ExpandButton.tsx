import { type MouseEvent } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { useTheme } from '@mui/material/styles';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { getCommonTooltipProps } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Button, ButtonProps, Icon } from '@blueprintjs/core';

export interface MRT_ExpandButtonProps<TData extends MRT_RowData>
  extends ButtonProps {
  row: MRT_Row<TData>;
  staticRowIndex?: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_ExpandButton = <TData extends MRT_RowData>({
  row,
  staticRowIndex,
  table,
}: MRT_ExpandButtonProps<TData>) => {
  const theme = useTheme();
  const {
    getState,
    options: {
      localization,
      muiExpandButtonProps,
      positionExpandColumn,
      renderDetailPanel,
    },
  } = table;
  const { density } = getState();

  const iconButtonProps = parseFromValuesOrFunc(muiExpandButtonProps, {
    row,
    staticRowIndex,
    table,
  });

  const canExpand = row.getCanExpand();
  const isExpanded = row.getIsExpanded();

  const handleToggleExpand = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    row.toggleExpanded();
    iconButtonProps?.onClick?.(event);
  };

  const detailPanel = !!renderDetailPanel?.({ row, table });

  return (
    <Tooltip
      disableHoverListener={!canExpand && !detailPanel}
      {...getCommonTooltipProps()}
      title={
        iconButtonProps?.title ??
        (isExpanded ? localization.collapse : localization.expand)
      }
    >
      <span>
        <Button
          minimal
          aria-label={localization.expand}
          disabled={!canExpand && !detailPanel}
          onClick={handleToggleExpand}
          {...iconButtonProps}
          css={(theme: any) => ({
            height: density === 'compact' ? '1.75rem' : '2.25rem',
            opacity: !canExpand && !detailPanel ? 0.3 : 1,
            [theme.direction === 'rtl' || positionExpandColumn === 'last'
              ? 'marginRight'
              : 'marginLeft']: `${row.depth * 16}px`,
            width: density === 'compact' ? '1.75rem' : '2.25rem',
            ...(parseFromValuesOrFunc(iconButtonProps?.css, theme) as any),
          })}
          title={undefined}
        >
          {iconButtonProps?.children ?? (
            <Icon
              icon="chevron-down"
              style={{
                transform: `rotate(${
                  !canExpand && !renderDetailPanel
                    ? positionExpandColumn === 'last' ||
                      theme.direction === 'rtl'
                      ? 90
                      : -90
                    : isExpanded
                      ? -180
                      : 0
                }deg)`,
                transition: 'transform 150ms',
              }}
            />
          )}
        </Button>
      </span>
    </Tooltip>
  );
};
