import { type ReactNode } from 'react';
import { Button } from '@blueprintjs/core';
import Box from '@mui/material/Box';
import ListItemIcon from '@mui/material/ListItemIcon';
import MenuItem, { type MenuItemProps } from '@mui/material/MenuItem';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';

export interface MRT_ActionMenuItemProps<TData extends MRT_RowData>
  extends MenuItemProps {
  icon: ReactNode;
  label: string;
  onOpenSubMenu?: MenuItemProps['onClick'] | MenuItemProps['onMouseEnter'];
  table: MRT_TableInstance<TData>;
}

export const MRT_ActionMenuItem = <TData extends MRT_RowData>({
  icon,
  label,
  onOpenSubMenu,
  table,
  ...rest
}: MRT_ActionMenuItemProps<TData>) => {
  const {
    options: {
      icons: { ArrowRightIcon },
    },
  } = table;

  return (
    <MenuItem
      sx={{
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: '120px',
        marginTop: 0,
        marginBottom: 0,
        paddingTop: '6px',
        paddingBottom: '6px',
      }}
      {...rest}
    >
      <Box
        sx={{
          alignItems: 'center',
          display: 'flex',
        }}
      >
        <ListItemIcon>{icon}</ListItemIcon>
        {label}
      </Box>
      {onOpenSubMenu && (
        <Button
          minimal
          icon="arrow-right"
          onClick={onOpenSubMenu as any}
          onMouseEnter={onOpenSubMenu as any}
          size="small"
          sx={{ p: 0 }}
        />
      )}
    </MenuItem>
  );
};
