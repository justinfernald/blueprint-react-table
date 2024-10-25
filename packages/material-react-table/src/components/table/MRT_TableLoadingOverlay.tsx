import { Spinner, SpinnerProps } from '@blueprintjs/core';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { alpha } from '../../utils/color.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Box } from '../primitives/Box';

export interface MRT_TableLoadingOverlayProps<TData extends MRT_RowData>
  extends SpinnerProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_TableLoadingOverlay = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_TableLoadingOverlayProps<TData>) => {
  const {
    options: {
      localization,
      mrtTheme: { baseBackgroundColor },
      muiCircularProgressProps,
    },
  } = table;

  const circularProgressProps = {
    ...parseFromValuesOrFunc(muiCircularProgressProps, { table }),
    ...rest,
  };

  return (
    <Box
      css={{
        alignItems: 'center',
        backgroundColor: alpha(baseBackgroundColor, 0.5),
        bottom: 0,
        display: 'flex',
        justifyContent: 'center',
        left: 0,
        maxHeight: '100vh',
        position: 'absolute',
        right: 0,
        top: 0,
        width: '100%',
        zIndex: 3,
      }}
    >
      {circularProgressProps?.Component ?? (
        <Spinner
          aria-label={localization.noRecordsToDisplay}
          id="mrt-progress"
          // {...circularProgressProps}
        />
      )}
    </Box>
  );
};
