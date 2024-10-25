import { useEffect, useRef, useState } from 'react';
import {
  type MRT_Header,
  type MRT_RowData,
  type MRT_TableInstance,
} from '../../types';
import { parseFromValuesOrFunc } from '../../utils/utils';
import { MultiSlider } from '@blueprintjs/core';

export interface MRT_FilterRangeSliderProps<TData extends MRT_RowData> {
  header: MRT_Header<TData>;
  table: MRT_TableInstance<TData>;
}

export const MRT_FilterRangeSlider = <TData extends MRT_RowData>({
  header,
  table,
  ...rest
}: MRT_FilterRangeSliderProps<TData>) => {
  const {
    options: { enableColumnFilterModes, localization, muiFilterSliderProps },
    refs: { filterInputRefs },
  } = table;
  const { column } = header;
  const { columnDef } = column;

  const currentFilterOption = columnDef._filterFn;

  const showChangeModeButton =
    enableColumnFilterModes && columnDef.enableColumnFilterModes !== false;

  const sliderProps = {
    ...parseFromValuesOrFunc(muiFilterSliderProps, { column, table }),
    ...parseFromValuesOrFunc(columnDef.muiFilterSliderProps, { column, table }),
    ...rest,
  };

  let [min, max] =
    sliderProps.min !== undefined && sliderProps.max !== undefined
      ? [sliderProps.min, sliderProps.max]
      : column.getFacetedMinMaxValues() ?? [0, 1];

  //fix potential TanStack Table bugs where min or max is an array
  if (Array.isArray(min)) min = min[0];
  if (Array.isArray(max)) max = max[0];
  if (min === null) min = 0;
  if (max === null) max = 1;

  const [filterValues, setFilterValues] = useState([min, max]);
  const columnFilterValue = column.getFilterValue();

  const isMounted = useRef(false);

  useEffect(() => {
    if (isMounted.current) {
      if (columnFilterValue === undefined) {
        setFilterValues([min, max]);
      } else if (Array.isArray(columnFilterValue)) {
        setFilterValues(columnFilterValue);
      }
    }
    isMounted.current = true;
  }, [columnFilterValue, min, max]);

  return (
    <MultiSlider
      disableSwap
      max={max}
      min={min}
      onChange={(values) => {
        setFilterValues(values as [number, number]);
      }}
      value={filterValues}
      valueLabelDisplay="auto"
      {...sliderProps}
      css={(theme) => ({
        margin: 'auto',
        minWidth: `${column.getSize() - 50}px`,
        marginTop: !showChangeModeButton ? '10px' : '6px',
        paddingLeft: '4px',
        paddingRight: '4px',
        width: 'calc(100% - 8px)',
      })}
    />
  );
};
