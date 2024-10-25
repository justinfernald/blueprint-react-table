import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { Button, ButtonProps, Tooltip } from '@blueprintjs/core';

export interface MRT_ToggleGlobalFilterButtonProps<TData extends MRT_RowData>
  extends ButtonProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_ToggleGlobalFilterButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToggleGlobalFilterButtonProps<TData>) => {
  const {
    getState,
    options: { localization },
    refs: { searchInputRef },
    setShowGlobalFilter,
  } = table;
  const { globalFilter, showGlobalFilter } = getState();

  const handleToggleSearch = () => {
    setShowGlobalFilter(!showGlobalFilter);
    queueMicrotask(() => searchInputRef.current?.focus());
  };

  return (
    <Tooltip content={rest?.title ?? localization.showHideSearch}>
      <Button
        minimal
        icon={showGlobalFilter ? 'disable' : 'search'}
        aria-label={rest?.title ?? localization.showHideSearch}
        disabled={!!globalFilter}
        onClick={handleToggleSearch}
        {...rest}
        title={undefined}
      />
      {/* {showGlobalFilter ? <SearchOffIcon /> : <SearchIcon />} */}
    </Tooltip>
  );
};
