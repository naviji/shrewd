import React, { useState } from 'react'

import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ButtonBase, Toolbar, TextField } from '@mui/material'
import { unformat, format } from '../utils/moneyUtils'

import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'

import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import { lightBlue } from '@mui/material/colors'

const AccordionDetails = ({ children }: any) => {
  return (
        <MuiAccordionDetails
          sx={{
            padding: '0px',
            '& :last-child': {
              borderBottomLeftRadius: '10px',
              borderBottomRightRadius: '10px'
            }
            // borderTop: '1px solid rgba(0, 0, 0, .125)',
            // marginLeft: '16px'
          }}
        >
          {children}
        </MuiAccordionDetails>
  )
}

const Accordion = ({ children }: any) => {
  const [expanded, setExpanded] = useState(true)
  return (
          <MuiAccordion disableGutters elevation={0} square
            expanded={expanded}
            onChange={() => setExpanded(!expanded)}
            sx={{
              '&:not(:last-child)': {
                borderBottom: 0
              },
              '&:before': {
                display: 'none'
              }
            }}
          >
            {children}
          </MuiAccordion>
  )
}

const AccordionSummary = ({ children }: any) => {
  return (
          <MuiAccordionSummary
          aria-controls="panel1d-content"
          id="panel1d-header"
          expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '1rem' }} />}
          sx={{
            border: '1px solid rgba(186, 186, 186, 0.54)',
            borderTopLeftRadius: '10px',
            borderTopRightRadius: '10px',
            flexDirection: 'row-reverse',
            '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
              transform: 'rotate(90deg)'
            },
            '& .MuiAccordionSummary-content': {
              marginLeft: '8px'
            }
          }}
      >
          {children}
          </MuiAccordionSummary>
  )
}

// TODO : Extract this out
const InspectorHeader = ({ name, icon }: any) => {
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Typography align='left' variant='body1' noWrap
            sx={{
              justifyContent: 'flex-start',
              display: 'inline-block',
              verticalAlign: 'middle',
              textAlign: 'left',
              width: '100%',
              padding: '4px'
            }}>
            {name}
        </Typography>
        {icon}
    </Box>
  )
}

const Notes = () => {
  return (
    <Accordion>
        <AccordionSummary>
            <InspectorHeader name="Notes" icon={null}/>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            multiline
            fullWidth
            minRows={8}
            value='Enter your note here...'
            variant="standard"
            InputProps={{ disableUnderline: true }}
            sx={{
              '& .MuiInputBase-inputMultiline': {
                border: '1px solid rgba(186, 186, 186, 0.54)',
                padding: '16px',
                borderBottomLeftRadius: '10px',
                borderBottomRightRadius: '10px'
              },
              '& .MuiInputBase-fullWidth': {
                paddingTop: '0px',
                paddingBottom: '0px'
              }
            }}
          />
        </AccordionDetails>
    </Accordion>
  )
}

export default Notes
