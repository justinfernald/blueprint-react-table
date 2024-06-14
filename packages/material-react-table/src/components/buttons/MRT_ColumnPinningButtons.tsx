import Box, { type BoxProps } from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import {
  type MRT_Column,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Button } from '@blueprintjs/core';

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
      sx={(theme) => ({
        minWidth: '70px',
        textAlign: 'center',
        ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
      })}
    >
      {column.getIsPinned() ? (
        <Tooltip title={localization.unpin}>
          <Button
            minimal
            icon="pin"
            onClick={() => handlePinColumn(false)}
            // size="small"
          />
        </Tooltip>
      ) : (
        <>
          <Tooltip title={localization.pinToLeft}>
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
          <Tooltip title={localization.pinToRight}>
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
