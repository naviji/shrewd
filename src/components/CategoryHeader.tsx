import React from 'react'
import Checkbox from '@mui/material/Checkbox'
import { IconButton, Typography } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

const DisplayTitle = ({ name }: any) => {
  return (
        <Box
            sx={{
              display: 'inline-block',
              width: '150px',
              height: '100%',
              verticalAlign: 'middle',
              textAlign: 'right',
              paddingLeft: '8px',
              paddingRight: '8px'
            }}>
          <Typography align='left' sx={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '250px', verticalAlign: 'middle' }} variant='body1'>
                {name}
            </Typography>

          </Box>
  )
}
const CategoryHeader = () => {
  return (
      <React.Fragment>
      <CssBaseline />
      <Box sx={{
        display: 'flex',
        width: '100%',
        minWidth: '800px',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        border: '1px solid rgba(186, 186, 186, 0.54)',
        background: '#FFFFFF'
      }}>
          <Box sx={{ flexGrow: 5, minWidth: '350px' }}>
            <Checkbox />
            <IconButton sx={{ visibility: 'hidden' }} color="inherit">
              <ArrowDropDownIcon />
            </ IconButton>
            <Typography align='left' sx={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '250px', verticalAlign: 'middle' }} variant='body1'>
                Category Group
            </Typography>
            <IconButton color="inherit">
                < AddCircleOutlineIcon/>
            </IconButton>
          </Box>

          <DisplayTitle name="Budgeted" />
          <DisplayTitle name="Spent" />
          <DisplayTitle name="Balance" />
      </Box>
      </React.Fragment>
  )
}

export default CategoryHeader
