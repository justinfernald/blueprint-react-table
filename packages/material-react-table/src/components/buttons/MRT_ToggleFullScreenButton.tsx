import { useState } from 'react';
import { Button, ButtonProps, Tooltip } from '@blueprintjs/core';
import { type MRT_RowData, type MRT_TableInstance } from '../../types';

export interface MRT_ToggleFullScreenButtonProps<TData extends MRT_RowData>
  extends ButtonProps {
  table: MRT_TableInstance<TData>;
}

export const MRT_ToggleFullScreenButton = <TData extends MRT_RowData>({
  table,
  ...rest
}: MRT_ToggleFullScreenButtonProps<TData>) => {
  const {
    getState,
    options: { localization },
    setIsFullScreen,
  } = table;
  const { isFullScreen } = getState();

  const [tooltipOpened, setTooltipOpened] = useState(false);

  const handleToggleFullScreen = () => {
    setTooltipOpened(false);
    setIsFullScreen(!isFullScreen);
  };

  return (
    <Tooltip
      isOpen={tooltipOpened}
      content={rest?.title ?? localization.toggleFullScreen}
    >
      <Button
        minimal
        icon={isFullScreen ? 'minimize' : 'fullscreen'}
        aria-label={localization.toggleFullScreen}
        onClick={handleToggleFullScreen}
        onMouseEnter={() => setTooltipOpened(true)}
        onMouseLeave={() => setTooltipOpened(false)}
        {...rest}
        title={undefined}
      />
    </Tooltip>
  );
};
