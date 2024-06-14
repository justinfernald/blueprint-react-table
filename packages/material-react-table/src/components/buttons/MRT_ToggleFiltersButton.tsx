import Tooltip from '@mui/material/Tooltip';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { Button, ButtonProps } from '@blueprintjs/core';

export interface MRT_ToggleFiltersButtonProps<TData extends MRT_RowData>
  extends ButtonProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_ToggleFiltersButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToggleFiltersButtonProps<TData>) => {
  const {
    getState,
    options: { localization },
    setShowColumnFilters,
  } = table;
  const { showColumnFilters } = getState();

  const handleToggleShowFilters = () => {
    setShowColumnFilters(!showColumnFilters);
  };

  return (
    <Tooltip title={rest?.title ?? localization.showHideFilters}>
      <Button
        minimal
        icon={showColumnFilters ? 'filter' : 'filter-remove'}
        aria-label={localization.showHideFilters}
        onClick={handleToggleShowFilters}
        {...rest}
        title={undefined}
      />
    </Tooltip>
  );
};
