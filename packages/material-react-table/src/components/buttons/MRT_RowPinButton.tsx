import { type MouseEvent, useState } from 'react';
import { type RowPinningPosition } from '@tanstack/react-table';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { getCommonTooltipProps } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Button, ButtonProps, Tooltip } from '@blueprintjs/core';

export interface MRT_RowPinButtonProps<TData extends MRT_RowData>
  extends ButtonProps {
  pinningPosition: RowPinningPosition;
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_RowPinButton = <TData extends MRT_RowData>({
  pinningPosition,
  row,
  table,
  ...rest
}: MRT_RowPinButtonProps<TData>) => {
  const {
    options: {
      icons: { CloseIcon, PushPinIcon },
      localization,
      rowPinningDisplayMode,
    },
  } = table;

  const isPinned = row.getIsPinned();

  const [tooltipOpened, setTooltipOpened] = useState(false);

  const handleTogglePin = (event: MouseEvent<HTMLButtonElement>) => {
    setTooltipOpened(false);
    event.stopPropagation();
    row.pin(isPinned ? false : pinningPosition);
  };

  return (
    <Tooltip
      {...getCommonTooltipProps()}
      isOpen={tooltipOpened}
      content={isPinned ? localization.unpin : localization.pin}
    >
      <Button
        aria-label={localization.pin}
        onClick={handleTogglePin as any}
        onMouseEnter={() => setTooltipOpened(true)}
        onMouseLeave={() => setTooltipOpened(false)}
        small
        {...rest}
        css={(theme) => ({
          height: '24px',
          width: '24px',
        })}
        className={rest.className}
      >
        {isPinned ? (
          <CloseIcon />
        ) : (
          <PushPinIcon
            fontSize="small"
            style={{
              transform: `rotate(${
                rowPinningDisplayMode === 'sticky'
                  ? 135
                  : pinningPosition === 'top'
                    ? 180
                    : 0
              }deg)`,
            }}
          />
        )}
      </Button>
    </Tooltip>
  );
};
