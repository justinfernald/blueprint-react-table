import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { getCommonTooltipProps } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Select, SelectProps } from '@blueprintjs/select';
import { Button, ButtonGroup, MenuItem } from '@blueprintjs/core';

const defaultRowsPerPage = [5, 10, 15, 20, 25, 30, 50, 100];

type ItemType =
  | {
      label: string;
      value: number;
    }
  | number;

export interface MRT_TablePaginationProps<TData extends MRT_RowData>
  extends Partial<{
    SelectProps?: Partial<SelectProps<ItemType>>;
    disabled?: boolean;
    rowsPerPageOptions?: { label: string; value: number }[] | number[];
    showRowsPerPage?: boolean;
  }> {
  position?: 'bottom' | 'top';
  table: MRT_TableInstance<TData>;
}

export const MRT_TablePagination = <TData extends MRT_RowData>({
  position = 'bottom',
  table,
  ...rest
}: MRT_TablePaginationProps<TData>) => {
  const {
    getState,
    options: {
      enableToolbarInternalActions,
      localization,
      muiPaginationProps,
      paginationDisplayMode,
    },
  } = table;
  const {
    pagination: { pageIndex = 0, pageSize = 10 },
    showGlobalFilter,
  } = getState();

  const paginationProps = {
    ...parseFromValuesOrFunc(muiPaginationProps, {
      table,
    }),
    ...rest,
  };

  const totalRowCount = table.getRowCount();
  const numberOfPages = table.getPageCount();
  const showFirstLastPageButtons = numberOfPages > 2;
  const firstRowIndex = pageIndex * pageSize;
  const lastRowIndex = Math.min(pageIndex * pageSize + pageSize, totalRowCount);

  const {
    SelectProps = {},
    disabled = false,
    rowsPerPageOptions = defaultRowsPerPage,
    showFirstButton = showFirstLastPageButtons,
    showLastButton = showFirstLastPageButtons,
    showRowsPerPage = true,
    // ...restPaginationProps
  } = paginationProps ?? {};

  const disableBack = pageIndex <= 0 || disabled;
  const disableNext = lastRowIndex >= totalRowCount || disabled;

  // if (isMobile && SelectProps?.native !== false) {
  //   SelectProps.native = true;
  // }

  const tooltipProps = getCommonTooltipProps();

  return (
    <Box
      className="MuiTablePagination-root"
      sx={{
        alignItems: 'center',
        display: 'flex',
        flexWrap: 'wrap',
        gap: '8px',
        justifyContent: { md: 'space-between', sm: 'center' },
        justifySelf: 'flex-end',
        marginTop:
          position === 'top' &&
          enableToolbarInternalActions &&
          !showGlobalFilter
            ? '3rem'
            : undefined,
        position: 'relative',
        paddingLeft: '8px',
        paddingRight: '8px',
        paddingTop: '12px',
        paddingBottom: '12px',
        zIndex: 2,
      }}
    >
      {showRowsPerPage && (
        <Box sx={{ alignItems: 'center', display: 'flex', gap: '8px' }}>
          {localization.rowsPerPage}
          <Select<ItemType>
            items={rowsPerPageOptions}
            disabled={disabled}
            aria-label={localization.rowsPerPage}
            onItemSelect={(item) =>
              table.setPageSize(typeof item === 'number' ? item : item.value)
            }
            itemPredicate={(query, item, _index, exactMatch) => {
              if (exactMatch) {
                if (typeof item === 'number') {
                  return item === parseInt(query, 10);
                } else {
                  return item.value === parseInt(query, 10);
                }
              } else {
                if (typeof item === 'number') {
                  return item.toString().includes(query);
                } else {
                  return item.label.includes(query);
                }
              }
            }}
            filterable={false}
            itemRenderer={(item, { handleClick, handleFocus, modifiers }) => {
              if (!modifiers.matchesPredicate) {
                return null;
              }

              return (
                <MenuItem
                  active={modifiers.active}
                  disabled={modifiers.disabled}
                  key={typeof item === 'number' ? item : item.value}
                  onClick={handleClick}
                  onFocus={handleFocus}
                  roleStructure="listoption"
                  text={typeof item === 'number' ? item : item.value}
                />
              );
            }}
            menuProps={{ style: { minWidth: 'unset' } }}
            {...(SelectProps as any)}
          >
            <Button minimal rightIcon="chevron-down">
              {pageSize}
            </Button>
          </Select>
        </Box>
      )}
      {paginationDisplayMode === 'pages' ? (
        <div>No pagination yet</div>
      ) : // <Pagination
      //   count={numberOfPages}
      //   disabled={disabled}
      //   onChange={(_e, newPageIndex) => table.setPageIndex(newPageIndex - 1)}
      //   page={pageIndex + 1}
      //   renderItem={(item) => (
      //     <PaginationItem
      //       slots={{
      //         first: FirstPageIcon,
      //         last: LastPageIcon,
      //         next: ChevronRightIcon,
      //         previous: ChevronLeftIcon,
      //       }}
      //       {...item}
      //     />
      //   )}
      //   showFirstButton={showFirstButton}
      //   showLastButton={showLastButton}
      //   {...restPaginationProps}
      // />
      paginationDisplayMode === 'default' ? (
        <>
          <span
          // align="center"
          // component="span"
          // sx={{ m: '0 4px', minWidth: '8ch' }}
          // variant="body2"
          >{`${
            lastRowIndex === 0 ? 0 : (firstRowIndex + 1).toLocaleString()
          }-${lastRowIndex.toLocaleString()} ${
            localization.of
          } ${totalRowCount.toLocaleString()}`}</span>
          <Box gap="xs">
            <ButtonGroup>
              {showFirstButton && (
                <Tooltip {...tooltipProps} title={localization.goToFirstPage}>
                  <Button
                    minimal
                    aria-label={localization.goToFirstPage}
                    disabled={disableBack}
                    onClick={() => table.firstPage()}
                    icon="double-chevron-left"
                  />
                </Tooltip>
              )}
              <Tooltip {...tooltipProps} title={localization.goToPreviousPage}>
                <Button
                  minimal
                  aria-label={localization.goToPreviousPage}
                  disabled={disableBack}
                  onClick={() => table.previousPage()}
                  icon="chevron-left"
                />
              </Tooltip>
              <Tooltip {...tooltipProps} title={localization.goToNextPage}>
                <Button
                  minimal
                  aria-label={localization.goToNextPage}
                  disabled={disableNext}
                  onClick={() => table.nextPage()}
                  icon="chevron-right"
                />
              </Tooltip>
              {showLastButton && (
                <Tooltip {...tooltipProps} title={localization.goToLastPage}>
                  <Button
                    minimal
                    aria-label={localization.goToLastPage}
                    disabled={disableNext}
                    onClick={() => table.lastPage()}
                    icon="double-chevron-right"
                  />
                </Tooltip>
              )}
            </ButtonGroup>
          </Box>
        </>
      ) : null}
    </Box>
  );
};
