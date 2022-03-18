import React, { useState } from 'react'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ButtonBase } from '@mui/material'
import { unformat } from '../utils/moneyUtils'

const AccordionSummary = ({ children }: any) => {
  return (
        <MuiAccordionSummary
        aria-controls="panel1d-content"
        id="panel1d-header"
        expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color: 'white' }} />}
        sx={{
          backgroundColor: 'black',
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

const ListItem = ({ name, amount, isHeader }: any) => {
  const [hover, setHover] = useState(false)
  return (
    <ButtonBase
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{
          display: 'flex',
          padding: '8px',
          marginTop: '4px',
          marginBottom: '4px',
          justifyContent: 'space-between',
          width: '100%',
          background: hover && !isHeader ? 'darkblue' : 'black',
          borderRadius: '8px',
          '& .MuiTypography-body1': {
            background: hover && !isHeader ? 'darkblue' : 'black'
          }
        }}
    >
        <Box sx={{ flex: 0 }}>
            <Typography
                align='left'
                variant='body1'
                noWrap
                sx={{ color: 'white' }}
            >
                {name}
            </Typography>
        </Box>

        <Box sx={{ flex: 0 }}>
            <Typography
                align='right'
                variant='body1'
                noWrap
                sx={{ color: unformat(amount) >= 0 ? '#CDEA9F' : '#FF7474' }}
            >
                {amount}
            </Typography>
        </Box>

    </ButtonBase>
  )
}

const AccordionDetails = ({ children }: any) => {
  return (
        <MuiAccordionDetails
          sx={{
            padding: '8x',
            borderTop: '1px solid rgba(0, 0, 0, .125)'
          }}
        >
          {children}
        </MuiAccordionDetails>
  )
}

const Accordion = ({ panel, expanded, handleChange, children }: any) => {
  return (
          <MuiAccordion disableGutters elevation={0} square
            expanded={expanded.indexOf(panel) !== -1}
            onChange={handleChange(panel)}
            sx={{
              '&:not(:last-child)': {
                borderBottom: 0
              },
              '&:before': {
                display: 'none'
              },
              background: 'black',
              color: 'white',
              border: '1px solid black'
            }}
          >
            {children}
          </MuiAccordion>
  )
}

export default function SidebarAccounts () {
  const [expanded, setExpanded] = React.useState<Array<string>>(['panel1', 'panel2'])

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      const idx = expanded.indexOf(panel)
      if (idx !== -1) {
        setExpanded(expanded.filter(x => x !== panel))
      } else {
        setExpanded(expanded.concat(panel))
      }
    }

  // let backgroundColor = '#CDEA9F'
  // if (amount < 0) {
  //   backgroundColor = '#FF7474'
  return (
    <Box sx={{
      maxWidth: '300px',
      width: '100%',
      justifyContent: 'flex-start',
      display: 'inline-block',
      verticalAlign: 'middle',
      textAlign: 'left',
      background: 'black',
      color: 'white',
      padding: '4px',
      overflow: 'visible',
      '& .MuiTypography-body1': {
        width: 'fit-content',
        paddingTop: '0px',
        paddingBottom: '0px',
        background: '#000000'
      }
    }}
    >
      <Accordion panel="panel1" expanded={expanded} handleChange={handleChange}>
        <AccordionSummary>
          <ListItem name="On Budget" amount="$1,123,456.00" isHeader={true} />
        </AccordionSummary>
        <AccordionDetails>
            <ListItem name="Savings" amount="$1,123,456.00" isHeader={false} />
            <ListItem name="Current" amount="$1,123,456.00" isHeader={false} />
            <ListItem name="Credit Card" amount="-$1,123,456.00" isHeader={false} />
        </AccordionDetails>
      </Accordion>

      <Accordion panel="panel2" expanded={expanded} handleChange={handleChange}>
        <AccordionSummary>
            <ListItem name="Off Budget" amount="$1,123,456.00" isHeader={true} />
        </AccordionSummary>
        <AccordionDetails>
            <ListItem name="Stocks" amount="$1,123,456.00" isHeader={false} />
            <ListItem name="Bonds" amount="$1,123,456.00" isHeader={false} />
            <ListItem name="Real Estate" amount="-$1,123,456.00" isHeader={false} />
        </AccordionDetails>
      </Accordion>

    </Box>
  )
}
