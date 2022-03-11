import * as React from 'react'
import Link from '@mui/material/Link'
import Table from '@mui/material/Table'
import TableBody from '@mui/material/TableBody'
import TableCell from '@mui/material/TableCell'
import TableHead from '@mui/material/TableHead'
import TableRow from '@mui/material/TableRow'
import Title from './Title'

import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import { IconButton, Toolbar } from '@mui/material'

import Checkbox from '@mui/material/Checkbox'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import { nanoid } from 'nanoid'

// Generate Order Data
function createData (
  id: number,
  date: string,
  name: string,
  shipTo: string,
  paymentMethod: string,
  amount: number
) {
  return { id, date, name, shipTo, paymentMethod, amount }
}

const data = [
  {
    id: nanoid(),
    name: 'True Expenses',
    budgeted: '$1,123,456.00',
    spent: '$1,123,456.00',
    balance: '$1,123,456.00',
    categories: [
      {
        id: nanoid(),
        name: 'Audible',
        budgeted: '$1,123,456.00',
        spent: '$1,123,456.00',
        balance: '$1,123,456.00'
      },
      {
        id: nanoid(),
        name: 'Internet',
        budgeted: '$1,123,456.00',
        spent: '$1,123,456.00',
        balance: '$1,123,456.00'
      },
      {
        id: nanoid(),
        name: 'Groceries',
        budgeted: '$1,123,456.00',
        spent: '$1,123,456.00',
        balance: '$1,123,456.00'
      }
    ]
  },
  {
    id: nanoid(),
    name: 'True Expenses',
    budgeted: '$1,123,456.00',
    spent: '$1,123,456.00',
    balance: '$1,123,456.00',
    categories: [
      {
        id: nanoid(),
        name: 'Audible',
        budgeted: '$1,123,456.00',
        spent: '$1,123,456.00',
        balance: '$1,123,456.00'
      },
      {
        id: nanoid(),
        name: 'Internet',
        budgeted: '$1,123,456.00',
        spent: '$1,123,456.00',
        balance: '$1,123,456.00'
      },
      {
        id: nanoid(),
        name: 'Groceries',
        budgeted: '$1,123,456.00',
        spent: '$1,123,456.00',
        balance: '$1,123,456.00'
      }
    ]
  },
  {
    id: nanoid(),
    name: 'True Expenses',
    budgeted: '$1,123,456.00',
    spent: '$1,123,456.00',
    balance: '$1,123,456.00',
    categories: [
      {
        id: nanoid(),
        name: 'Audible',
        budgeted: '$1,123,456.00',
        spent: '$1,123,456.00',
        balance: '$1,123,456.00'
      },
      {
        id: nanoid(),
        name: 'Internet',
        budgeted: '$1,123,456.00',
        spent: '$1,123,456.00',
        balance: '$1,123,456.00'
      },
      {
        id: nanoid(),
        name: 'Groceries',
        budgeted: '$1,123,456.00',
        spent: '$1,123,456.00',
        balance: '$1,123,456.00'
      }
    ]
  },
  {
    id: nanoid(),
    name: 'True Expenses',
    budgeted: '$1,123,456.00',
    spent: '$1,123,456.00',
    balance: '$1,123,456.00',
    categories: [
      {
        id: nanoid(),
        name: 'Audible',
        budgeted: '$1,123,456.00',
        spent: '$1,123,456.00',
        balance: '$1,123,456.00'
      },
      {
        id: nanoid(),
        name: 'Internet',
        budgeted: '$1,123,456.00',
        spent: '$1,123,456.00',
        balance: '$1,123,456.00'
      },
      {
        id: nanoid(),
        name: 'Groceries',
        budgeted: '$1,123,456.00',
        spent: '$1,123,456.00',
        balance: '$1,123,456.00'
      }
    ]
  }
]

function preventDefault (event: React.MouseEvent) {
  event.preventDefault()
}

const label = { inputProps: { 'aria-label': 'Checkbox demo' } }

const CategoryHeader = () => {
  return (
    <TableRow>
            <TableCell>
            <Checkbox {...label} /> Category Group
            <IconButton color="inherit"> <AddCircleOutlineIcon fontSize='small' />
              </ IconButton>
              </TableCell>
            <TableCell align="right">Budgeted</TableCell>
            <TableCell align="right">Spent</TableCell>
            <TableCell align="right">Balance</TableCell>
            {/* <TableCell align="right">Sale Amount</TableCell> */}
          </TableRow>
  )
}

const CategoryGroupRow = ({ data }) => {
  return (
    <TableRow sx={{ background: '#f0f0f0' }}>
            <TableCell>
            <Checkbox {...label} />
            <IconButton color="inherit">
            <ArrowDropDownIcon />
            </ IconButton>
            {data.name}
            <IconButton color="inherit"> <AddCircleOutlineIcon fontSize='small' />
              </ IconButton>

              </TableCell>
            <TableCell align="right">{data.budgeted}</TableCell>
            <TableCell align="right">{data.spent}</TableCell>
            <TableCell align="right">{data.balance}</TableCell>
            {/* <TableCell align="right">Sale Amount</TableCell> */}
          </TableRow>
  )
}

const CategoryRow = ({ data }) => {
  return (
    <TableRow sx={{ }}>
            <TableCell>
            <Checkbox {...label} />
            <IconButton color="inherit">
            <ArrowDropDownIcon />
            </ IconButton>
            {data.name}

              </TableCell>
            <TableCell align="right">{data.budgeted}</TableCell>
            <TableCell align="right">{data.spent}</TableCell>
            <TableCell align="right">{data.balance}</TableCell>
            {/* <TableCell align="right">Sale Amount</TableCell> */}
          </TableRow>
  )
}

export default function Orders () {
  return (
    <React.Fragment>
      <Table sx={{ minWidth: 650 }}>
        <TableHead>
          <CategoryHeader />
        </TableHead>
        <TableBody>
          {data.map((row) => (
            <>
            <CategoryGroupRow key={row.id} data={row}/>
            {row.categories.map((subRow) => (
              <CategoryRow key={subRow.id} data={subRow}/>
            ))}
            </>
          ))}
        </TableBody>
      </Table>
    </React.Fragment>
  )
}
