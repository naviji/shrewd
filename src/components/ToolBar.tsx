import React from 'react'
import { IconButton, Typography, Button, ButtonBase } from '@mui/material'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import HistoryIcon from '@mui/icons-material/History'
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined'
import ArrowLeftOutlinedIcon from '@mui/icons-material/ArrowLeftOutlined'
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'

import InfoIcon from '@mui/icons-material/Info'

import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

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
const ToolBar = () => {
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
            <IconButton color="inherit">
                <UndoIcon />
            </IconButton>
            <IconButton color="inherit">
                <RedoIcon />
            </IconButton>
            <IconButton color="inherit">
                <HistoryIcon />
            </IconButton>

            <ButtonBase sx={{
              background: '#CDEA9F',
              paddingTop: '4px',
              paddingBottom: '4px',
              paddingLeft: '8px',
              paddingRight: '8px',
              marginTop: '8px',
              marginBottom: '8px',
              borderRadius: '16px'
            }}>
                 <IconButton color="inherit">
                 <InfoIcon />
                 </IconButton>

            <Typography align='right' sx={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '250px', verticalAlign: 'middle' }} variant="h6">
                $123,456,789.00
            </Typography>

                    <ExpandMoreIcon />

            </ButtonBase>

            <Box sx={{ display: 'inline', marginLeft: '8px', marginRight: '8px' }}>
                <ButtonBase sx={{
                  border: '2px solid black',
                  borderRadius: '100px'
                }}>
                    <ArrowLeftIcon fontSize="large" />
                </ButtonBase>

                <Typography align='right' sx={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '250px', verticalAlign: 'middle', marginLeft: '8px', marginRight: '8px' }} variant="h6">
                    SEP 2022
                </Typography>

                <ButtonBase sx={{
                  border: '2px solid black',
                  borderRadius: '100px'
                }}>
                    <ArrowRightIcon fontSize="large" />
                </ButtonBase>
            </Box>

          </Box>

      </Box>
      </React.Fragment>
  )
}

export default ToolBar
