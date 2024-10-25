import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_RowPinButton } from '../buttons/MRT_RowPinButton';
import { Box } from '../primitives/Box';

export interface MRT_TableBodyRowPinButtonProps<TData extends MRT_RowData> {
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableBodyRowPinButton = <TData extends MRT_RowData>({
  row,
  table,
  ...rest
}: MRT_TableBodyRowPinButtonProps<TData>) => {
  const {
    getState,
    options: { enableRowPinning, rowPinningDisplayMode },
  } = table;
  const { density } = getState();

  const canPin = parseFromValuesOrFunc(enableRowPinning, row as any);

  if (!canPin) return null;

  const rowPinButtonProps = {
    row,
    table,
    ...rest,
  };

  if (rowPinningDisplayMode === 'top-and-bottom' && !row.getIsPinned()) {
    return (
      <Box
        css={{
          display: 'flex',
          flexDirection: density === 'compact' ? 'row' : 'column',
        }}
      >
        <MRT_RowPinButton pinningPosition="top" {...rowPinButtonProps} />
        <MRT_RowPinButton pinningPosition="bottom" {...rowPinButtonProps} />
      </Box>
    );
  }

  return (
    <MRT_RowPinButton
      pinningPosition={rowPinningDisplayMode === 'bottom' ? 'bottom' : 'top'}
      {...rowPinButtonProps}
    />
  );
};
