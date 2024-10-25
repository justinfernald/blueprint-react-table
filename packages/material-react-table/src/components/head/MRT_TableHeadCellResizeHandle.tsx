import { Divider, DividerProps } from '@blueprintjs/core';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { Box } from '../primitives/Box';

export interface MRT_TableHeadCellResizeHandleProps<TData extends MRT_RowData>
  extends DividerProps {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_TableHeadCellResizeHandle = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: MRT_TableHeadCellResizeHandleProps<TData>) => {
  const {
    getState,
    options: { columnResizeDirection, columnResizeMode },
    setColumnSizingInfo,
  } = table;
  const { density } = getState();
  const { column } = header;

  const handler = header.getResizeHandler();

  const mx =
    density === 'compact'
      ? '-8px'
      : density === 'comfortable'
        ? '-16px'
        : '-24px';

  const lr = column.columnDef.columnDefType === 'display' ? '4px' : '0';

  return (
    <Box
      className="Mui-TableHeadCell-ResizeHandle-Wrapper"
      onDoubleClick={() => {
        setColumnSizingInfo((old) => ({
          ...old,
          isResizingColumn: false,
        }));
        column.resetSize();
      }}
      onMouseDown={handler}
      onTouchStart={handler}
      style={{
        transform:
          column.getIsResizing() && columnResizeMode === 'onEnd'
            ? `translateX(${
                (columnResizeDirection === 'rtl' ? -1 : 1) *
                (getState().columnSizingInfo.deltaOffset ?? 0)
              }px)`
            : undefined,
      }}
      css={(theme) => ({
        '&:active > hr': {
          backgroundColor: theme.palette.info.main,
          opacity:
            header.subHeaders.length || columnResizeMode === 'onEnd' ? 1 : 0,
        },
        cursor: 'col-resize',
        left: columnResizeDirection === 'rtl' ? lr : undefined,
        marginLeft: columnResizeDirection === 'rtl' ? mx : undefined,
        marginRight: columnResizeDirection === 'ltr' ? mx : undefined,
        position: 'absolute',
        paddingLeft: '4px',
        paddingRight: '4px',
        right: columnResizeDirection === 'ltr' ? lr : undefined,
      })}
    >
      <Divider
        className="Mui-TableHeadCell-ResizeHandle-Divider"
        css={(theme) => ({
          borderRadius: '2px',
          borderWidth: '2px',
          height: '24px',
          touchAction: 'none',
          transform: 'translateX(4px)',
          transition: column.getIsResizing()
            ? undefined
            : 'all 150ms ease-in-out',
          userSelect: 'none',
          zIndex: 4,
          // ...(parseFromValuesOrFunc(rest?.css, theme) as any),
        })}
      />
    </Box>
  );
};
