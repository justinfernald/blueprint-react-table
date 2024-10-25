import { type MouseEvent, useState } from 'react';
import { Button, ButtonProps, Tooltip } from '@blueprintjs/core';
import { MRT_EditActionButtons } from './MRT_EditActionButtons';
import {
  type MRT_Cell,
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { getCommonTooltipProps } from '../../utils/style.utils';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MRT_RowActionMenu } from '../menus/MRT_RowActionMenu';

const commonIconButtonStyles = {
  '&:hover': {
    opacity: 1,
  },
  height: '2rem',
  marginLeft: '10px',
  opacity: 0.5,
  transition: 'opacity 150ms',
  width: '2rem',
};

export interface MRT_ToggleRowActionMenuButtonProps<TData extends MRT_RowData>
  extends ButtonProps {
  cell: MRT_Cell<TData>;
  row: MRT_Row<TData>;
  staticRowIndex?: number;
  table: MRT_TableInstance<TData>;
}

export const MRT_ToggleRowActionMenuButton = <TData extends MRT_RowData>({
  cell,
  row,
  staticRowIndex,
  table,
  ...rest
}: MRT_ToggleRowActionMenuButtonProps<TData>) => {
  const {
    getState,
    options: {
      createDisplayMode,
      editDisplayMode,
      enableEditing,
      localization,
      renderRowActionMenuItems,
      renderRowActions,
    },
    setEditingRow,
  } = table;

  const { creatingRow, editingRow } = getState();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const showEditActionButtons =
    (isCreating && createDisplayMode === 'row') ||
    (isEditing && editDisplayMode === 'row');

  const [anchorEl, setAnchorEl] = useState<HTMLElement | null>(null);

  const handleOpenRowActionMenu = (event: MouseEvent<HTMLElement>) => {
    event.stopPropagation();
    event.preventDefault();
    setAnchorEl(event.currentTarget);
  };

  const handleStartEditMode = (event: MouseEvent) => {
    event.stopPropagation();
    setEditingRow({ ...row });
    setAnchorEl(null);
  };

  return (
    <>
      {renderRowActions && !showEditActionButtons ? (
        renderRowActions({ cell, row, staticRowIndex, table })
      ) : showEditActionButtons ? (
        <MRT_EditActionButtons row={row} table={table} />
      ) : !renderRowActionMenuItems &&
        parseFromValuesOrFunc(enableEditing, row) &&
        ['modal', 'row'].includes(editDisplayMode!) ? (
        <Tooltip position="right" content={localization.edit}>
          <Button
            minimal
            icon="edit"
            aria-label={localization.edit}
            onClick={handleStartEditMode}
            css={commonIconButtonStyles}
            {...rest}
          />
        </Tooltip>
      ) : renderRowActionMenuItems ? (
        <>
          <Tooltip
            {...getCommonTooltipProps()}
            content={localization.rowActions}
          >
            <Button
              minimal
              icon="more"
              aria-label={localization.rowActions}
              onClick={handleOpenRowActionMenu}
              // small // unsure if this is wanted
              css={commonIconButtonStyles}
              {...rest}
            />
          </Tooltip>
          <MRT_RowActionMenu
            anchorEl={anchorEl}
            handleEdit={handleStartEditMode}
            row={row}
            setAnchorEl={setAnchorEl}
            staticRowIndex={staticRowIndex}
            table={table}
          />
        </>
      ) : null}
    </>
  );
};
