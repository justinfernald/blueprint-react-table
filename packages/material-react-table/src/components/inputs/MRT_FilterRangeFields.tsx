import { MRT_FilterTextField } from './MRT_FilterTextField';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Box } from '../primitives/Box';

export interface MRT_FilterRangeFieldsProps<TData extends MRT_RowData>
  extends BoxProps {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_FilterRangeFields = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: MRT_FilterRangeFieldsProps<TData>) => {
  return (
    <Box
      {...rest}
      css={(theme) => ({
        display: 'grid',
        gap: '1rem',
        gridTemplateColumns: '1fr 1fr',
      })}
    >
      {[0, 1].map((rangeFilterIndex) => (
        <MRT_FilterTextField
          header={header}
          key={rangeFilterIndex}
          rangeFilterIndex={rangeFilterIndex}
          table={table}
        />
      ))}
    </Box>
  );
};
