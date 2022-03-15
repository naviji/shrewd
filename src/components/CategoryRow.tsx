import React from 'react'
import Checkbox from '@mui/material/Checkbox'
import { IconButton, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Box from '@mui/material/Box'
import MoneyCell from './MoneyCell'

/*

Text align and padding of input need to be done using global css styles.
https://mui.com/api/input/
https://mui.com/guides/interoperability/#global-css
https://mui.com/customization/theme-components/#global-style-overrides
*/

interface CategoryRowProps {
  name: String,
  budgeted: number,
  spent: number,
  balance: number,
  saveBudgetedAmount: Function,
  isGroup: Boolean
}

const CategoryRow = ({ name, budgeted, spent, balance, saveBudgetedAmount, isGroup }: CategoryRowProps) => {
  const bgColor = isGroup ? '#F0F0F0' : '#FFFFFF'
  return (
    <Box sx={{
      display: 'flex',
      width: '100%',
      minWidth: '800px',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid rgba(186, 186, 186, 0.54)',
      background: bgColor
    }}>
        <Box sx={{ flexGrow: 5, minWidth: '350px' }}>
          <Checkbox />
          <IconButton sx={{ visibility: isGroup ? 'visible' : 'hidden' }} color="inherit">
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
