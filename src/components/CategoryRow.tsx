import React from 'react'
import TableRow from '@mui/material/TableRow'
import TableCell from '@mui/material/TableCell'
import Checkbox from '@mui/material/Checkbox'
import { IconButton, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Box from '@mui/material/Box'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import MoneyCell from './MoneyCell'
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
    <Box sx={{
      display: 'flex',
      width: '100%',
      minWidth: '800px',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid rgba(186, 186, 186, 0.54)'
    }}>
        <Box sx={{ flexGrow: 5, minWidth: '350px' }}>
            <Checkbox />
            <IconButton sx={{ visibility: 'visible' }} color="inherit">
              <ArrowDropDownIcon />
            </ IconButton>
            <Box sx={{ display: 'inline-block', verticalAlign: 'middle' }}>
                <Typography align='left' sx={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '250px', verticalAlign: 'middle' }} variant='body1'>
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
