import { Button, ButtonProps, Icon, Spinner } from '@blueprintjs/core';
import Box, { type BoxProps } from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Tooltip from '@mui/material/Tooltip';
import {
  type MRT_Row,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';

export interface MRT_EditActionButtonsProps<TData extends MRT_RowData>
  extends BoxProps {
  row: MRT_Row<TData>;
  table: MRT_TableInstance<TData>;
  variant?: 'icon' | 'text';
}

export const MRT_EditActionButtons = <TData extends MRT_RowData>({
  row,
  table,
  variant = 'icon',
  ...rest
}: MRT_EditActionButtonsProps<TData>) => {
  const {
    getState,
    options: {
      localization,
      onCreatingRowCancel,
      onCreatingRowSave,
      onEditingRowCancel,
      onEditingRowSave,
    },
    refs: { editInputRefs },
    setCreatingRow,
    setEditingRow,
  } = table;
  const { creatingRow, editingRow, isSaving } = getState();

  const isCreating = creatingRow?.id === row.id;
  const isEditing = editingRow?.id === row.id;

  const handleCancel = () => {
    if (isCreating) {
      onCreatingRowCancel?.({ row, table });
      setCreatingRow(null);
    } else if (isEditing) {
      onEditingRowCancel?.({ row, table });
      setEditingRow(null);
    }
    row._valuesCache = {} as any; //reset values cache
  };

  const handleSubmitRow = () => {
    //look for auto-filled input values
    Object.values(editInputRefs?.current)
      .filter((inputRef) => row.id === inputRef?.name?.split('_')?.[0])
      ?.forEach((input) => {
        if (
          input.value !== undefined &&
          Object.hasOwn(row?._valuesCache as object, input.name)
        ) {
          // @ts-ignore
          row._valuesCache[input.name] = input.value;
        }
      });
    if (isCreating)
      onCreatingRowSave?.({
        exitCreatingMode: () => setCreatingRow(null),
        row,
        table,
        values: row._valuesCache,
      });
    else if (isEditing) {
      onEditingRowSave?.({
        exitEditingMode: () => setEditingRow(null),
        row,
        table,
        values: row?._valuesCache,
      });
    }
  };

  return (
    <Box
      onClick={(e) => e.stopPropagation()}
      sx={(theme) => ({
        display: 'flex',
        gap: '0.75rem',
        ...(parseFromValuesOrFunc(rest?.sx, theme) as any),
      })}
    >
      {variant === 'icon' ? (
        <>
          <Tooltip title={localization.cancel}>
            <Button
              minimal
              icon="cross-circle"
              aria-label={localization.cancel}
              onClick={handleCancel}
            />
          </Tooltip>
          {((isCreating && onCreatingRowSave) ||
            (isEditing && onEditingRowSave)) && (
            <Tooltip title={localization.save}>
              <Button
                minimal
                aria-label={localization.save}
                color="info"
                disabled={isSaving}
                onClick={handleSubmitRow}
              >
                {isSaving ? <Spinner size={18} /> : <Icon icon="floppy-disk" />}
              </Button>
            </Tooltip>
          )}
        </>
      ) : (
        <>
          <Button onClick={handleCancel} css={{ minWidth: '100px' }}>
            {localization.cancel}
          </Button>
          <Button
            disabled={isSaving}
            onClick={handleSubmitRow}
            css={{ minWidth: '100px' }}
          >
            {isSaving && <Spinner size={18} />}
            {localization.save}
          </Button>
        </>
      )}
    </Box>
  );
};
