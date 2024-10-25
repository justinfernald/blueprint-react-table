import { type MouseEvent, useState } from 'react';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { MRT_ShowHideColumnsMenu } from '../menus/MRT_ShowHideColumnsMenu';
import { Button, ButtonProps, Tooltip } from '@blueprintjs/core';

export interface MRT_ShowHideColumnsButtonProps<TData extends MRT_RowData>
  extends ButtonProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_ShowHideColumnsButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ShowHideColumnsButtonProps<TData>) => {
  const {
    options: { localization },
  } = table;

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleClick = (event: MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  return (
    <>
      <Tooltip content={rest?.title ?? localization.showHideColumns}>
        <Button
          minimal
          icon="eye-open"
          aria-label={localization.showHideColumns}
          onClick={handleClick}
          {...rest}
          title={undefined}
        />
      </Tooltip>
      {anchorEl && (
        <MRT_ShowHideColumnsMenu
          anchorEl={anchorEl}
          setAnchorEl={setAnchorEl}
          table={table}
        />
      )}
    </>
  );
};
