import React from 'react'
import Checkbox from '@mui/material/Checkbox'
import { IconButton, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Box from '@mui/material/Box'
import MoneyCell from './MoneyCell'

interface CategoryRowProps {
  name: String,
  budgeted: number,
  spent: number,
  balance: number,
  saveBudgetedAmount: Function
}
const CategoryRow = ({ name, budgeted, spent, balance, saveBudgetedAmount }: CategoryRowProps) => {
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
              {name}
            </Typography>
          </Box>
        </Box>
      <MoneyCell editable={true} colored={false} amount={budgeted} saveChangedAmount={saveBudgetedAmount}/>
      <MoneyCell editable={false} colored={false} amount={spent} saveChangedAmount={() => null}/>
      <MoneyCell editable={false} colored={true} amount={balance} saveChangedAmount={() => null} />
    </Box>
  )
}

export default CategoryRow
