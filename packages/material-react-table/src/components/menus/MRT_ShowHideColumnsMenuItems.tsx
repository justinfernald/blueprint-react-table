import {
  type Dispatch,
  type DragEvent,
  type SetStateAction,
  useRef,
  useState,
} from 'react';
import Box from '@mui/material/Box';
import FormControlLabel from '@mui/material/FormControlLabel';
import Tooltip from '@mui/material/Tooltip';
import {
  type MRT_Column,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { reorderColumn } from '../../utils/column.utils';
import { getCommonTooltipProps } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_ColumnPinningButtons } from '../buttons/MRT_ColumnPinningButtons';
import { MRT_GrabHandleButton } from '../buttons/MRT_GrabHandleButton';
import {
  Button,
  ButtonProps,
  Colors,
  MenuItemProps,
  Switch,
} from '@blueprintjs/core';

export interface MRT_ShowHideColumnsMenuItemsProps<TData extends MRT_RowData>
  extends ButtonProps {
  allColumns: MRT_Column<TData>[];
  column: MRT_Column<TData>;
  hoveredColumn: MRT_Column<TData> | null;
  isNestedColumns: boolean;
  setHoveredColumn: Dispatch<SetStateAction<MRT_Column<TData> | null>>;
  table: MRT_TableInstance<TData>;
}

export const MRT_ShowHideColumnsMenuItems = <TData extends MRT_RowData>({
  allColumns,
  column,
  hoveredColumn,
  isNestedColumns,
  setHoveredColumn,
  table,
  ...rest
}: MRT_ShowHideColumnsMenuItemsProps<TData>) => {
  const {
    getState,
    options: {
      enableColumnOrdering,
      enableColumnPinning,
      enableHiding,
      localization,
      mrtTheme: { draggingBorderColor },
    },
    setColumnOrder,
  } = table;
  const { columnOrder } = getState();
  const { columnDef } = column;
  const { columnDefType } = columnDef;

  const switchChecked = column.getIsVisible();

  const handleToggleColumnHidden = (column: MRT_Column<TData>) => {
    if (columnDefType === 'group') {
      column?.columns?.forEach?.((childColumn: MRT_Column<TData>) => {
        childColumn.toggleVisibility(!switchChecked);
      });
    } else {
      column.toggleVisibility();
    }
  };

  const menuItemRef = useRef<HTMLElement>(null);

  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: DragEvent<HTMLButtonElement>) => {
    setIsDragging(true);
    try {
      e.dataTransfer.setDragImage(menuItemRef.current as HTMLElement, 0, 0);
    } catch (e) {
      console.error(e);
    }
  };

  const handleDragEnd = (_e: DragEvent<HTMLButtonElement>) => {
    setIsDragging(false);
    setHoveredColumn(null);
    if (hoveredColumn) {
      setColumnOrder(reorderColumn(column, hoveredColumn, columnOrder));
    }
  };

  const handleDragEnter = (_e: DragEvent) => {
    if (!isDragging && columnDef.enableColumnOrdering !== false) {
      setHoveredColumn(column);
    }
  };

  if (!columnDef.header || columnDef.visibleInShowHideMenu === false) {
    return null;
  }

  return (
    <>
      <Button
        minimal
        fill
        // onDragEnter={handleDragEnter}
        ref={menuItemRef as any}
        {...rest}
        css={(theme) => ({
          display: 'flex',
          flexDirection: 'row',
          width: '100%',
          alignItems: 'center',
          justifyContent: 'flex-start',
          marginTop: 0,
          marginBottom: 0,
          opacity: isDragging ? 0.5 : 1,
          outline: isDragging
            ? `2px dashed ${Colors.GRAY5}`
            : hoveredColumn?.id === column.id
              ? `2px dashed ${draggingBorderColor}`
              : 'none',
          outlineOffset: '-2px',
          paddingLeft: `${(column.depth + 0.5) * 2}rem`,
          paddingTop: '6px',
          paddingBottom: '6px',
          ...(parseFromValuesOrFunc(rest?.css, theme) as any),
        })}
      >
        <Box
          sx={{
            width: 'max-content',
            display: 'flex',
            flexWrap: 'nowrap',
            gap: '8px',
          }}
        >
          {columnDefType !== 'group' &&
            enableColumnOrdering &&
            !isNestedColumns &&
            (columnDef.enableColumnOrdering !== false ? (
              <MRT_GrabHandleButton
                onDragEnd={handleDragEnd}
                onDragStart={handleDragStart}
                table={table}
              />
            ) : (
              <Box sx={{ width: '28px' }} />
            ))}
          {enableColumnPinning &&
            (column.getCanPin() ? (
              <MRT_ColumnPinningButtons column={column} table={table} />
            ) : (
              <Box sx={{ width: '70px' }} />
            ))}
          {enableHiding ? (
            // <Tooltip
            //   {...getCommonTooltipProps()}
            //   title={localization.toggleVisibility}
            // >
            <div
              css={{
                display: 'flex',
                alignItems: 'center',
                alignSelf: 'center',
              }}
            >
              <Switch
                css={{ margin: 0 }}
                checked={switchChecked}
                disabled={!column.getCanHide()}
                labelElement={columnDef.header}
                onChange={() => handleToggleColumnHidden(column)}
              />
            </div>
          ) : (
            // {/* </Tooltip> */}
            <span css={{ alignSelf: 'center' }}>{columnDef.header}</span>
          )}
        </Box>
      </Button>
      {column.columns?.map((c: MRT_Column<TData>, i) => (
        <MRT_ShowHideColumnsMenuItems
          text={columnDef.header}
          allColumns={allColumns}
          column={c}
          hoveredColumn={hoveredColumn}
          isNestedColumns={isNestedColumns}
          key={`${i}-${c.id}`}
          setHoveredColumn={setHoveredColumn}
          table={table}
        />
      ))}
    </>
  );
};
