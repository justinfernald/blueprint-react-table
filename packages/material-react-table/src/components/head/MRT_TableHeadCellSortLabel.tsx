import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Button, ButtonProps, Tag, Tooltip } from '@blueprintjs/core';

export interface MRT_TableHeadCellSortLabelProps<TData extends MRT_RowData>
  extends ButtonProps {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCellSortLabel = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: MRT_TableHeadCellSortLabelProps<TData>) => {
  const {
    getState,
    options: { localization },
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { isLoading, showSkeletons, sorting } = getState();

  const isSorted = !!column.getIsSorted();

  const sortTooltip =
    isLoading || showSkeletons
      ? ''
      : column.getIsSorted()
        ? column.getIsSorted() === 'desc'
          ? localization.sortedByColumnDesc.replace(
              '{column}',
              columnDef.header,
            )
          : localization.sortedByColumnAsc.replace('{column}', columnDef.header)
        : column.getNextSortingOrder() === 'desc'
          ? localization.sortByColumnDesc.replace('{column}', columnDef.header)
          : localization.sortByColumnAsc.replace('{column}', columnDef.header);

  const direction = isSorted
    ? (column.getIsSorted() as 'asc' | 'desc')
    : undefined;

  return (
    <Tooltip placement="top" content={sortTooltip}>
      <div css={{ position: 'relative' }}>
        <Tag
          css={{
            position: 'absolute',
            top: 0,
            right: 0,
            transform: 'translate(50%, 50%)',
          }}
          content={`${sorting.length > 1 ? column.getSortIndex() + 1 : 0}`}
          // badgeContent={sorting.length > 1 ? column.getSortIndex() + 1 : 0}
          // overlap="circular"
        />
        <Button
          minimal
          // IconComponent={
          //   !isSorted
          //     ? (props) => <Icon icon="double-caret-vertical" />
          //     : (props) => (
          //         <Icon
          //           icon={direction === 'asc' ? 'caret-down' : 'caret-up'}
          //         />
          //       )
          // }
          icon={
            isSorted
              ? direction === 'asc'
                ? 'caret-down'
                : 'caret-up'
              : 'double-caret-vertical'
          }
          aria-label={sortTooltip}
          // direction={direction}
          onClick={(e) => {
            e.stopPropagation();
            header.column.getToggleSortingHandler()?.(e);
          }}
          {...rest}
          css={(theme: any) => ({
            '.MuiTableSortLabel-icon': {
              color: `${
                theme.palette.mode === 'dark'
                  ? theme.palette.text.primary
                  : theme.palette.text.secondary
              } !important`,
            },
            flex: '0 0',
            opacity: isSorted ? 1 : 0.3,
            transition: 'all 150ms ease-in-out',
            width: '3ch',
            ...(parseFromValuesOrFunc(rest?.css, theme) as any),
          })}
        />
      </div>
    </Tooltip>
  );
};
