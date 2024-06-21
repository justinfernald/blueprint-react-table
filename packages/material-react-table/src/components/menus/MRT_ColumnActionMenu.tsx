import { type MouseEvent, useState } from 'react';
import { MRT_ActionMenuItem } from './MRT_ActionMenuItem';
import { MRT_FilterOptionMenu } from './MRT_FilterOptionMenu';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { Button, Icon, Menu, Popover, PopoverProps } from '@blueprintjs/core';

export interface MRT_ColumnActionMenuProps<TData extends MRT_RowData>
  extends Partial<PopoverProps> {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onClick?: (event: MouseEvent<HTMLElement>) => void;
}

export const MRT_ColumnActionMenu = <TData extends MRT_RowData>({
  setIsOpen,
  isOpen,
  onClick,
  header,
  table,
  ...rest
}: MRT_ColumnActionMenuProps<TData>) => {
  const {
    getAllLeafColumns,
    getState,
    options: {
      columnFilterDisplayMode,
      columnFilterModeOptions,
      enableColumnFilterModes,
      enableColumnFilters,
      enableColumnPinning,
      enableColumnResizing,
      enableGrouping,
      enableHiding,
      enableSorting,
      enableSortingRemoval,
      icons: {
        ClearAllIcon,
        DynamicFeedIcon,
        FilterListIcon,
        FilterListOffIcon,
        PushPinIcon,
        RestartAltIcon,
        SortIcon,
        ViewColumnIcon,
        VisibilityOffIcon,
      },
      localization,
      mrtTheme: { menuBackgroundColor },
      renderColumnActionsMenuItems,
    },
    refs: { filterInputRefs },
    setColumnFilterFns,
    setColumnOrder,
    setColumnSizingInfo,
    setShowColumnFilters,
  } = table;
  const { column } = header;
  const { columnDef } = column;
  const { columnSizing, columnVisibility, density, showColumnFilters } =
    getState();
  const columnFilterValue = column.getFilterValue();

  const [filterMenuAnchorEl, setFilterMenuAnchorEl] =
    useState<HTMLElement | null>(null);

  const handleClearSort = () => {
    column.clearSorting();
    setIsOpen(false);
  };

  const handleSortAsc = () => {
    column.toggleSorting(false);
    setIsOpen(false);
  };

  const handleSortDesc = () => {
    column.toggleSorting(true);
    setIsOpen(false);
  };

  const handleResetColumnSize = () => {
    setColumnSizingInfo((old) => ({ ...old, isResizingColumn: false }));
    column.resetSize();
    setIsOpen(false);
  };

  const handleHideColumn = () => {
    column.toggleVisibility(false);
    setIsOpen(false);
  };

  const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
    column.pin(pinDirection);
    setIsOpen(false);
  };

  const handleGroupByColumn = () => {
    column.toggleGrouping();
    setColumnOrder((old: any) => ['mrt-row-expand', ...old]);
    setIsOpen(false);
  };

  const handleClearFilter = () => {
    column.setFilterValue(undefined);
    setIsOpen(false);
    if (['empty', 'notEmpty'].includes(columnDef._filterFn)) {
      setColumnFilterFns((prev) => ({
        ...prev,
        [header.id]: allowedColumnFilterOptions?.[0] ?? 'fuzzy',
      }));
    }
  };

  const handleFilterByColumn = () => {
    setShowColumnFilters(true);
    queueMicrotask(() => filterInputRefs.current[`${column.id}-0`]?.focus());
    setIsOpen(false);
  };

  const handleShowAllColumns = () => {
    getAllLeafColumns()
      .filter((col) => col.columnDef.enableHiding !== false)
      .forEach((col) => col.toggleVisibility(true));
    setIsOpen(false);
  };

  const handleOpenFilterModeMenu = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    setFilterMenuAnchorEl(event.currentTarget);
  };

  const isSelectFilter = !!columnDef.filterSelectOptions;

  const allowedColumnFilterOptions =
    columnDef?.columnFilterModeOptions ?? columnFilterModeOptions;

  const showFilterModeSubMenu =
    enableColumnFilterModes &&
    columnDef.enableColumnFilterModes !== false &&
    !isSelectFilter &&
    (allowedColumnFilterOptions === undefined ||
      !!allowedColumnFilterOptions?.length);

  const internalColumnMenuItems = [
    ...(enableSorting && column.getCanSort()
      ? [
          enableSortingRemoval !== false && (
            <MRT_ActionMenuItem
              icon={'clean'}
              key={0}
              label={localization.clearSort}
              onClick={handleClearSort}
              table={table}
            />
          ),
          <MRT_ActionMenuItem
            disabled={column.getIsSorted() === 'asc'}
            icon={'sort-asc'}
            key={1}
            label={localization.sortByColumnAsc?.replace(
              '{column}',
              String(columnDef.header),
            )}
            onClick={handleSortAsc}
            table={table}
          />,
          <MRT_ActionMenuItem
            disabled={column.getIsSorted() === 'desc'}
            // divider={enableColumnFilters || enableGrouping || enableHiding}
            icon={'sort-desc'}
            key={2}
            label={localization.sortByColumnDesc?.replace(
              '{column}',
              String(columnDef.header),
            )}
            onClick={handleSortDesc}
            table={table}
          />,
        ]
      : []),
    ...(enableColumnFilters && column.getCanFilter()
      ? [
          <MRT_ActionMenuItem
            disabled={
              !columnFilterValue ||
              (Array.isArray(columnFilterValue) &&
                !columnFilterValue.filter((value) => value).length)
            }
            icon={'filter-remove'}
            key={3}
            label={localization.clearFilter}
            onClick={handleClearFilter}
            table={table}
          />,
          columnFilterDisplayMode === 'subheader' && (
            <MRT_ActionMenuItem
              disabled={showColumnFilters && !enableColumnFilterModes}
              // divider={enableGrouping || enableHiding}
              icon={'filter-list'}
              key={4}
              label={localization.filterByColumn?.replace(
                '{column}',
                String(columnDef.header),
              )}
              onClick={
                showColumnFilters
                  ? handleOpenFilterModeMenu
                  : handleFilterByColumn
              }
              onOpenSubMenu={
                showFilterModeSubMenu ? handleOpenFilterModeMenu : undefined
              }
              table={table}
            />
          ),
          showFilterModeSubMenu && (
            <MRT_FilterOptionMenu
              anchorEl={filterMenuAnchorEl}
              header={header}
              key={5}
              onSelect={handleFilterByColumn}
              setAnchorEl={setFilterMenuAnchorEl}
              table={table}
            />
          ),
        ].filter(Boolean)
      : []),
    ...(enableGrouping && column.getCanGroup()
      ? [
          <MRT_ActionMenuItem
            // divider={enableColumnPinning}
            icon={'group-objects'}
            key={6}
            label={localization[
              column.getIsGrouped() ? 'ungroupByColumn' : 'groupByColumn'
            ]?.replace('{column}', String(columnDef.header))}
            onClick={handleGroupByColumn}
            table={table}
          />,
        ]
      : []),
    ...(enableColumnPinning && column.getCanPin()
      ? [
          <MRT_ActionMenuItem
            disabled={column.getIsPinned() === 'left' || !column.getCanPin()}
            icon={<Icon icon="pin" style={{ transform: 'rotate(90deg)' }} />}
            key={7}
            label={localization.pinToLeft}
            onClick={() => handlePinColumn('left')}
            table={table}
          />,
          <MRT_ActionMenuItem
            disabled={column.getIsPinned() === 'right' || !column.getCanPin()}
            icon={<Icon icon="pin" style={{ transform: 'rotate(-90deg)' }} />}
            key={8}
            label={localization.pinToRight}
            onClick={() => handlePinColumn('right')}
            table={table}
          />,
          <MRT_ActionMenuItem
            disabled={!column.getIsPinned()}
            // divider={enableHiding}
            icon={<Icon icon="pin" />}
            key={9}
            label={localization.unpin}
            onClick={() => handlePinColumn(false)}
            table={table}
          />,
        ]
      : []),
    ...(enableColumnResizing && column.getCanResize()
      ? [
          <MRT_ActionMenuItem
            disabled={!columnSizing[column.id]}
            icon={'reset'}
            key={10}
            label={localization.resetColumnSize}
            onClick={handleResetColumnSize}
            table={table}
          />,
        ]
      : []),
    ...(enableHiding
      ? [
          <MRT_ActionMenuItem
            disabled={!column.getCanHide()}
            icon={'eye-off'}
            key={11}
            label={localization.hideColumn?.replace(
              '{column}',
              String(columnDef.header),
            )}
            onClick={handleHideColumn}
            table={table}
          />,
          <MRT_ActionMenuItem
            disabled={
              !Object.values(columnVisibility).filter((visible) => !visible)
                .length
            }
            icon={'eye-on'}
            key={12}
            label={localization.showAllColumns?.replace(
              '{column}',
              String(columnDef.header),
            )}
            onClick={handleShowAllColumns}
            table={table}
          />,
        ]
      : []),
  ].filter(Boolean);

  return (
    <Popover
      lazy
      onClose={() => setIsOpen(false)}
      onClosing={() => setIsOpen(false)}
      placement="bottom-start"
      isOpen={isOpen}
      content={
        <Menu>
          {columnDef.renderColumnActionsMenuItems?.({
            closeMenu: () => setIsOpen(false),
            column,
            internalColumnMenuItems,
            table,
          }) ??
            renderColumnActionsMenuItems?.({
              closeMenu: () => setIsOpen(false),
              column,
              internalColumnMenuItems,
              table,
            }) ??
            internalColumnMenuItems}
        </Menu>
      }
      // MenuListProps={{
      //   dense: density === 'compact',
      //   sx: {
      //     backgroundColor: menuBackgroundColor,
      //   },
      // }}
      // ulRef={anchorEl}
      // disableScrollLock

      {...rest}
    >
      <Button onClick={onClick} minimal icon="more" />
    </Popover>
  );
};
