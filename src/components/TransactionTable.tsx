import React, { memo, useState, useCallback, useMemo, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import { AgGridReact } from 'ag-grid-react'
import DatePicker from 'react-datepicker'
import dayjs from 'dayjs'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'react-datepicker/dist/react-datepicker.css'

import { unixMsFromDate } from '../utils/timeUtils'
import { TextField } from '@mui/material'
import { Box } from '@mui/system'
const customParseFormat = require('dayjs/plugin/customParseFormat')
dayjs.extend(customParseFormat)

const CustomDateInput = forwardRef(({ value, onClick }: any, ref) => {
  const displayValue = useMemo(() => {
    return dayjs(value, 'MM/DD/YYYY').format('DD/MM/YYYY')
  }, [value])

  const inputRef = useRef(null)
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
      inputRef.current.click()
    }
  }, [])

  return (
      <Box sx={{
        width: '100%',
        '& .MuiInputBase-input': {
          padding: '8px',
          width: '100%'
        }
      }}>
          <TextField
          onClick={onClick}
          inputRef={inputRef}
          value={displayValue}
          style={{ width: '100%' }}
      />
      </Box>

  )
})
CustomDateInput.displayName = 'CustomDateInput'

const DateEditor = forwardRef((props: any, ref) => {
  const [startDate, setStartDate] = useState(new Date(unixMsFromDate(props.value)))

  useImperativeHandle(ref, () => {
    return {
      getValue () {
        return dayjs(startDate).format('DD/MM/YYYY')
      }
    }
  })

  return (
    <DatePicker
        selected={startDate}
        onChange={(date:Date) => setStartDate(date)}
        customInput={<CustomDateInput />} />
  )
})

DateEditor.displayName = 'DateEditor'

const RowCheckBox = memo((props) => {
  // checked={params.value === 'checked'} onChange={onChangeHandler}

  const onChangeHandler = (e) => {
    console.log('Changed', e)
  }
  return (
    <>
      <input type='checkbox' onChange={onChangeHandler}/>
      </>
  )
})
RowCheckBox.displayName = 'RowCheckBox'

const HeaderCheckBox = memo((props) => {
  const onChangeHandler = (e) => {
    console.log('Changed header', e)
  }
  // const [sortState, setSortState] = useState();

  //   const onClick = useCallback(() => {
  //     console.log('clicked')
  //     // props.progressSort();
  //   })

  // useEffect(() => {
  //     const listener = () => {
  //         if (props.column.isSortAscending()) {
  //             setSortState('ASC');
  //         } else if (props.column.isSortDescending()) {
  //             setSortState('DESC');
  //         } else {
  //             setSortState(undefined);
  //         }
  //     };

  //     props.column.addEventListener('sortChanged', listener);

  //     return () => props.column.removeEventListener('sortChanged', listener);;
  // }, []);

  return (
    <input type='checkbox' onChange={onChangeHandler} />
  )
})

HeaderCheckBox.displayName = 'HeaderCheckBox'

const TransactionTable = () => {
  const [rowData] = useState([
    { date: '01/01/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' },
    { date: '02/01/2022', payee: 'Home Depot', category: 'Income', memo: '', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' },
    { date: '04/01/2022', payee: 'Extra Warranty', category: 'Medical', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' },
    { date: '10/01/2022', payee: 'Online store', category: 'Gift', memo: '', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' },
    { date: '21/01/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' },
    { date: '01/02/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'n' },
    { date: '01/02/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'n' },
    { date: '02/02/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' },
    { date: '10/02/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'n' },
    { date: '30/02/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' },
    { date: '01/03/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' }
  ])

  const [columnDefs] = useState([
    {

      headerName: 'Selected',
      field: 'selected',
      editable: true,
      cellRenderer: RowCheckBox,
      headerComponent: HeaderCheckBox

    },
    {
      field: 'date',
      editable: true,
      cellEditor: DateEditor,
      cellEditorPopup: true
    },
    { field: 'payee' },
    { field: 'category' },
    { field: 'memo' },
    { field: 'outflow' },
    { field: 'inflow' },
    { field: 'cleared' }

  ])

  // never changes, so we can use useMemo
  const defaultColDef = useMemo(() => ({
    resizable: true,
    sortable: true,
    editable: true,
    suppressMovable: true
  }), [])

  const autoGroupColumnDef = useMemo(() => ({
    cellRendererParams: {
      checkbox: true
    }
  }), [])

  return (
       <div className="ag-theme-alpine" style={{ height: '600px', width: '1000px' }}>
           <AgGridReact
               rowData={rowData}
               columnDefs={columnDefs}
                defaultColDef={defaultColDef}
                rowSelection="multiple">
           </AgGridReact>
       </div>
  )
}

export default TransactionTable
