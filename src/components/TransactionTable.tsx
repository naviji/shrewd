import React, { memo, useMemo, useState, forwardRef, useEffect, useImperativeHandle, useRef } from 'react'
import DatePicker from 'react-datepicker'
import dayjs from 'dayjs'

import 'ag-grid-community/dist/styles/ag-grid.css'
import 'ag-grid-community/dist/styles/ag-theme-alpine.css'
import 'react-datepicker/dist/react-datepicker.css'

import { unixMsFromDate } from '../utils/timeUtils'
import { TextField, IconButton, Typography } from '@mui/material'
import { Box } from '@mui/system'

import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'

import DataGrid from 'react-data-grid'

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

const PayeeSelector = forwardRef((props: any, ref) => {
  useEffect(() => {
    console.log('props', props)
    console.log('ref', ref)
  })

  useImperativeHandle(ref, () => {
    return {
      getValue () {
        return 'Achan'
      }
    }
  })

  return (
      <Box sx={{ height: `${props.node.rowHeight}px` }}>
        <Box sx={{ width: `${props.column.actualWidth}px`, height: '100%' }}>
            <Typography sx={{ borderRadius: '4px', boxSizing: 'border-box', paddingTop: '8px', height: '100%', paddingLeft: '8px', paddingRight: '8px', border: '2px solid #1976d2' }}> Current payee </Typography>
        </Box>

        <Box sx={{
          width: `${props.column.actualWidth}px`,
          height: '0px',
          background: 'red'
        }}
        >
            <Box sx={{
              position: 'absolute',
              inset: '0px auto auto 0px',
              transform: 'translate3d(0px, 39px, 0px)',
              paddingTop: '10px',
              height: '242px',
              widht: '242px'
            }}>

            </Box>
      </Box>
    </Box>
  )
})
PayeeSelector.displayName = 'PayeeSelector'

const RowCheckBox = memo(() => {
  const onChangeHandler = (e: any) => {
    console.log('Changed', e)
  }
  return (
    <>
      <input type='checkbox' onChange={onChangeHandler}/>
      </>
  )
})
RowCheckBox.displayName = 'RowCheckBox'

const RowCleared = memo(() => {
  return (
      <>
        <IconButton color="inherit">
              <CheckCircleIcon fontSize="small"/>
        </ IconButton>
      </>
  )
})
RowCleared.displayName = 'RowCleared'

const HeaderCleared = memo(() => {
  return (
        <>
          <IconButton color="inherit">
                <CheckCircleOutlineIcon fontSize="small" />
          </ IconButton>

        </>
  )
})
HeaderCleared.displayName = 'HeaderCleared'

const HeaderCheckBox = memo(() => {
  const onChangeHandler = (e: any) => {
    console.log('Changed header', e)
  }

  return (
    <input type='checkbox' onChange={onChangeHandler} />
  )
})

HeaderCheckBox.displayName = 'HeaderCheckBox'

const TransactionTable = () => {
  const [rowData] = useState([
    { id: 1, date: '01/01/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' },
    { id: 2, date: '02/01/2022', payee: 'Home Depot', category: 'Income', memo: '', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' },
    { id: 3, date: '04/01/2022', payee: 'Extra Warranty', category: 'Medical', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' },
    { id: 4, date: '10/01/2022', payee: 'Online store', category: 'Gift', memo: '', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' },
    { id: 5, date: '21/01/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' },
    { id: 6, date: '01/02/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'n' },
    { id: 7, date: '01/02/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'n' },
    { id: 8, date: '02/02/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' },
    { id: 9, date: '10/02/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'n' },
    { id: 10, date: '30/02/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' },
    { id: 11, date: '01/03/2022', payee: 'Movies', category: 'Entertainment', memo: 'test', outflow: '$1,123,456.00', inflow: '$1,123,456.00', cleared: 'c' }
  ])

  const [columnDefs] = useState([
    {
      key: 'selected',
      name: 'selected'
      //   field: 'selected',
      //   editable: true,
      //   cellRenderer: RowCheckBox,
      //   headerComponent: HeaderCheckBox,
      //   width: 24

    },
    {
      key: 'date',
      name: 'Date'
    //   field: 'date',
    //   editable: true,
    //   cellEditor: DateEditor,
    //   cellEditorPopup: true
    },
    {
      key: 'payee',
      name: 'Payee'
    //   field: 'payee',
    //   editable: true,
    //   cellEditor: PayeeSelector,
    //   cellEditorPopup: true
    },
    {
      key: 'category',
      name: 'Category'
    },
    {
      key: 'memo',
      name: 'Memo'
    },
    {
      key: 'outflow',
      name: 'Outflow'
    },
    {
      key: 'inflow',
      name: 'Inflow'
    },
    {
      key: 'cleared',
      name: 'Cleared'
    }

  ])

  interface Row {
    date: string;
    payee: string;
    category: string;
    memo: string;
    outflow: string;
    inflow: string;
    cleared: string;

    id: number
  }

  function rowKeyGetter (row: Row): number {
    return row.id
  }

  return (
       <Box sx={{ height: '600px', width: '1000px' }}>
           <DataGrid columns={columnDefs} rows={rowData} rowKeyGetter={rowKeyGetter} />
       </Box>
  )
}

export default TransactionTable
