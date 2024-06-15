import { Button, MenuItem, MenuItemProps } from '@blueprintjs/core';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';

export interface MRT_ActionMenuItemProps<TData extends MRT_RowData>
  extends Partial<MenuItemProps> {
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
    options: {},
  } = table;

  return (
    <MenuItem
      css={{
        alignItems: 'center',
        justifyContent: 'space-between',
        minWidth: '120px',
        marginTop: 0,
        marginBottom: 0,
        paddingTop: '6px',
        paddingBottom: '6px',
      }}
      text={label}
      icon={icon}
      {...rest}
    >
      {onOpenSubMenu && (
        <Button
          minimal
          icon="arrow-right"
          onClick={onOpenSubMenu as any}
          onMouseEnter={onOpenSubMenu as any}
          // size="small"
          // css={{ padding: 0 }}
        />
      )}
    </MenuItem>
  );
};
