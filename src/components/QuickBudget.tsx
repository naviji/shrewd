import React, { useState } from 'react'

import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ButtonBase } from '@mui/material'
import { format } from '../utils/moneyUtils'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import OfflineBoltIcon from '@mui/icons-material/OfflineBolt'
import { MonthInfo } from '../types/Model'

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

const QuickBudgetItem = ({ name, amount }: any) => {
//   const [hover, setHover] = useState(false)
  return (
      <ButtonBase
            sx={{
              display: 'block',
              width: '100%',
              border: '1px solid rgba(186, 186, 186, 0.54)'
            }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignContent: 'center' }}>
                <Typography align='center' variant='body1' noWrap
                    sx={{
                      justifyContent: 'flex-start',
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      padding: '4px'
                    }}>
                    { name }
                </Typography>
                <Typography align='center' variant='body1' noWrap color="#15598F"
                    sx={{
                      justifyContent: 'flex-start',
                      display: 'inline-block',
                      verticalAlign: 'middle',
                      padding: '4px'
                    }}>
                    { format(amount) }
                </Typography>
        </Box>
      </ButtonBase>
  )
}

const QuickBudget = ({ items }: { items: MonthInfo[] }) => {
  return (
    <Accordion>
        <AccordionSummary>
            <InspectorHeader name="Quick Budget" icon={<OfflineBoltIcon sx={{ color: '#E7A100' }}/>}/>
        </AccordionSummary>
        <AccordionDetails>
            {
                items.map((item, idx) => <QuickBudgetItem key={idx} name={item.name} amount={item.amount} />)
            }
        </AccordionDetails>

    </Accordion>
  )
}

export default QuickBudget
