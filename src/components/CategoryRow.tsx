import React from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Checkbox from '@mui/material/Checkbox'
import { IconButton } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'

interface CategoryData {
  name: String,
  budgeted: String,
  spent: String,
  balance: String
}

interface CategoryRowProps {
    data: CategoryData;
}

const CategoryRow = ({ data }: CategoryRowProps) => {
  return (
      <TableRow sx={{ }}>
              <TableCell>
              <Checkbox />
              <IconButton color="inherit">
              <ArrowDropDownIcon />
              </ IconButton>
                {data.name}
              </TableCell>
              <TableCell align="right">{data.budgeted}</TableCell>
              <TableCell align="right">{data.spent}</TableCell>
              <TableCell align="right">{data.balance}</TableCell>
            </TableRow>
  )
}

export default CategoryRow
