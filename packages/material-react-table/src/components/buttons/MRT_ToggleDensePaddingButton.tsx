import { type MRT_RowData, type MRT_TableInstance } from '../../types';
import { Button, ButtonProps, Icon, Tooltip } from '@blueprintjs/core';

export interface MRT_ToggleDensePaddingButtonProps<TData extends MRT_RowData>
  extends ButtonProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_ToggleDensePaddingButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToggleDensePaddingButtonProps<TData>) => {
  const {
    getState,
    options: { localization },
    setDensity,
  } = table;
  const { density } = getState();

  const handleToggleDensePadding = () => {
    const nextDensity =
      density === 'comfortable'
        ? 'compact'
        : density === 'compact'
          ? 'spacious'
          : 'comfortable';
    setDensity(nextDensity);
  };

  return (
    <Tooltip content={rest?.title ?? localization.toggleDensity}>
      <Button
        minimal
        aria-label={localization.toggleDensity}
        onClick={handleToggleDensePadding}
        {...rest}
        title={undefined}
      >
        <Icon
          icon={
            density === 'compact'
              ? 'align-justify'
              : density === 'comfortable'
                ? 'list'
                : 'menu'
          }
        />
      </Button>
    </Tooltip>
  );
};
