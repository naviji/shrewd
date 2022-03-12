import React from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Checkbox from '@mui/material/Checkbox'
import { IconButton, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'

interface CategoryData {
  name: String,
  budgeted: String,
  spent: String,
  balance: String
}

interface CategoryRowProps {
    data: CategoryData;
}

const MoneyCell = ({ amount }) => {
  return (
    <Box sx={{ flexGrow: 1, minWidth: '20%', paddingTop: '8px' }}>
    <Typography align='center' sx={{ display: 'inline' }} variant='body1' noWrap>
          {amount}
    </Typography>
  </Box>
  )
}
const CategoryRow = ({ data }: CategoryRowProps) => {
  return (
    <Box sx={{ display: 'flex', width: '100%', flexDirection: 'row', justifyContent: 'space-between' }}>
        <Box sx={{ flexGrow: 5, minWidth: '400px' }}>
            <Checkbox />
            <IconButton sx={{ visibility: 'visible' }} color="inherit">
              <ArrowDropDownIcon />
            </ IconButton>
            <Box sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <Typography align='left' sx={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '300px' }} variant='body1'>
                {data.name}
              </Typography>
            </Box>

        </Box>

        <MoneyCell amount={data.budgeted} />
        <MoneyCell amount={data.spent} />
        <MoneyCell amount={data.balance} />
    </Box>
  )
}

export default CategoryRow
