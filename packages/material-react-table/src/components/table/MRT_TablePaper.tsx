import { Card, CardProps, Elevation } from '@blueprintjs/core';
import { MRT_TableContainer } from './MRT_TableContainer';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_BottomToolbar } from '../toolbar/MRT_BottomToolbar';
import { MRT_TopToolbar } from '../toolbar/MRT_TopToolbar';
import { useTheme } from '@emotion/react';

export interface MRT_TablePaperProps<TData extends MRT_RowData>
  extends CardProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_TablePaper = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_TablePaperProps<TData>) => {
  const {
    getState,
    options: {
      enableBottomToolbar,
      enableTopToolbar,
      mrtTheme: { baseBackgroundColor },
      muiTablePaperProps,
      renderBottomToolbar,
      renderTopToolbar,
    },
    refs: { tablePaperRef },
  } = table;
  const { isFullScreen } = getState();

  const paperProps = {
    ...parseFromValuesOrFunc(muiTablePaperProps, { table }),
    ...rest,
  };

  const theme = useTheme();

  return (
    <Card
      elevation={2 as any}
      {...paperProps}
      ref={(ref: HTMLDivElement) => {
        tablePaperRef.current = ref;
        if (paperProps?.ref) {
          //@ts-ignore
          paperProps.ref.current = ref;
        }
      }}
      style={{
        ...(isFullScreen
          ? {
              bottom: 0,
              height: '100dvh',
              left: 0,
              margin: 0,
              maxHeight: '100dvh',
              maxWidth: '100dvw',
              padding: 0,
              position: 'fixed',
              right: 0,
              top: 0,
              width: '100dvw',
              zIndex: theme.zIndex.modal,
            }
          : {}),
        ...paperProps?.style,
      }}
      css={(theme) => ({
        backgroundColor: baseBackgroundColor,
        backgroundImage: 'unset',
        overflow: 'hidden',
        transition: 'all 100ms ease-in-out',
      })}
    >
      {enableTopToolbar &&
        (parseFromValuesOrFunc(renderTopToolbar, { table }) ?? (
          <MRT_TopToolbar table={table} />
        ))}
      <MRT_TableContainer table={table} />
      {enableBottomToolbar &&
        (parseFromValuesOrFunc(renderBottomToolbar, { table }) ?? (
          <MRT_BottomToolbar table={table} />
        ))}
    </Card>
  );
};
