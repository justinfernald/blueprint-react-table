import Tooltip from '@mui/material/Tooltip';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { getCommonTooltipProps } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Button, ButtonProps, Icon } from '@blueprintjs/core';

export interface MRT_ExpandAllButtonProps<TData extends MRT_RowData>
  extends ButtonProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_ExpandAllButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ExpandAllButtonProps<TData>) => {
  const {
    getCanSomeRowsExpand,
    getIsAllRowsExpanded,
    getIsSomeRowsExpanded,
    getState,
    options: {
      icons: { KeyboardDoubleArrowDownIcon },
      localization,
      muiExpandAllButtonProps,
      renderDetailPanel,
    },
    toggleAllRowsExpanded,
  } = table;
  const { density, isLoading } = getState();

  const iconButtonProps = {
    ...parseFromValuesOrFunc(muiExpandAllButtonProps, {
      table,
    }),
    ...rest,
  };

  const isAllRowsExpanded = getIsAllRowsExpanded();

  return (
    <Tooltip
      {...getCommonTooltipProps()}
      title={
        iconButtonProps?.title ??
        (isAllRowsExpanded ? localization.collapseAll : localization.expandAll)
      }
    >
      <span>
        <Button
          minimal
          aria-label={localization.expandAll}
          disabled={
            isLoading || (!renderDetailPanel && !getCanSomeRowsExpand())
          }
          onClick={() => toggleAllRowsExpanded(!isAllRowsExpanded)}
          {...iconButtonProps}
          css={(theme) => ({
            height: density === 'compact' ? '1.75rem' : '2.25rem',
            marginTop: density !== 'compact' ? '-0.25rem' : undefined,
            width: density === 'compact' ? '1.75rem' : '2.25rem',
            ...(parseFromValuesOrFunc(iconButtonProps?.css, theme) as any),
          })}
          title={undefined}
        >
          {iconButtonProps?.children ?? (
            <Icon
              icon={'double-chevron-down'}
              style={{
                transform: `rotate(${
                  isAllRowsExpanded ? -180 : getIsSomeRowsExpanded() ? -90 : 0
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
