import {
  type MRT_Column,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Button, Tooltip } from '@blueprintjs/core';
import { Box, BoxProps } from '../primitives/Box';

export interface MRT_ColumnPinningButtonsProps<TData extends MRT_RowData>
  extends BoxProps {
  column: MRT_Column<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_ColumnPinningButtons = <TData extends MRT_RowData>({
  column,
  table,
  ...rest
}: MRT_ColumnPinningButtonsProps<TData>) => {
  const {
    options: {
      icons: { PushPinIcon },
      localization,
    },
  } = table;

  const handlePinColumn = (pinDirection: 'left' | 'right' | false) => {
    column.pin(pinDirection);
  };

  return (
    <Box
      {...rest}
      css={(theme) => ({
        minWidth: '70px',
        textAlign: 'center',
      })}
      className={rest.className}
    >
      {column.getIsPinned() ? (
        <Tooltip content={localization.unpin}>
          <Button
            minimal
            icon="pin"
            onClick={() => handlePinColumn(false)}
            // size="small"
          />
        </Tooltip>
      ) : (
        <>
          <Tooltip content={localization.pinToLeft}>
            <Button
              minimal
              icon="pin"
              onClick={() => handlePinColumn('left')}
              // size="small"
              style={{
                transform: 'rotate(90deg)',
              }}
            />
          </Tooltip>
          <Tooltip content={localization.pinToRight}>
            <Button
              minimal
              icon="pin"
              onClick={() => handlePinColumn('right')}
              // size="small"
              style={{
                transform: 'rotate(-90deg)',
              }}
            />
          </Tooltip>
        </>
      )}
    </Box>
  );
};
