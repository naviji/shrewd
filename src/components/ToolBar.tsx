import React from 'react'
import { IconButton, Typography, ButtonBase, TextField, InputAdornment } from '@mui/material'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import HistoryIcon from '@mui/icons-material/History'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import SearchIcon from '@mui/icons-material/Search'

import InfoIcon from '@mui/icons-material/Info'

import ArrowLeftIcon from '@mui/icons-material/ArrowLeft'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'

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
        <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 5, minWidth: '350px', justifyContent: 'space-between' }}>
            <Box sx={{ display: 'inline-block' }}>
                <IconButton color="inherit">
                    <UndoIcon />
                </IconButton>
                <IconButton color="inherit">
                    <RedoIcon />
                </IconButton>
                <IconButton color="inherit">
                    <HistoryIcon />
                </IconButton>
            </Box>

            <Box sx={{ display: 'inline-block' }}>
                <ButtonBase
                    sx={{
                      background: '#CDEA9F',
                      paddingTop: '4px',
                      paddingBottom: '4px',
                      paddingLeft: '8px',
                      paddingRight: '8px',
                      marginTop: '8px',
                      marginBottom: '8px',
                      borderRadius: '8px',
                      marginRight: '20px'
                    }}>
                    <IconButton color="inherit">
                    <InfoIcon />
                    </IconButton>

                    <Typography
                        align='right'
                        variant="h6"
                        sx={{
                          display: 'inline-block',
                          overflow: 'hidden',
                          whiteSpace: 'nowrap',
                          textOverflow: 'ellipsis',
                          maxWidth: '250px',
                          verticalAlign: 'middle'
                        }}>
                        $123,456,789.00
                    </Typography>
                    <ExpandMoreIcon />
                </ButtonBase>

                <ButtonBase
                    sx={{
                      border: '2px solid black',
                      borderRadius: '100px'
                    }}>
                    <ArrowLeftIcon fontSize="large" />
                </ButtonBase>

                <Typography align='right' variant="h6"
                    sx={{
                      display: 'inline-block',
                      overflow: 'hidden',
                      whiteSpace: 'nowrap',
                      textOverflow: 'ellipsis',
                      maxWidth: '250px',
                      verticalAlign: 'middle',
                      marginLeft: '8px',
                      marginRight: '8px'
                    }}>
                    SEP 2022
                </Typography>

                <ButtonBase
                    sx={{
                      border: '2px solid black',
                      borderRadius: '100px'
                    }}>
                    <ArrowRightIcon fontSize="large" />
                </ButtonBase>
            </Box>

            <Box
                sx={{
                  alignItems: 'center',
                  marginRight: '8px'
                }}>
                <TextField
                    placeholder='Filter Categories'
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon />
                        </InputAdornment>
                      )
                    }}/>
            </Box>
        </Box>
      </Box>
    </React.Fragment>
  )
}

export default ToolBar
