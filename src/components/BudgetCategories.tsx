import React, { useState } from 'react'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import { IconButton, ButtonBase, Toolbar } from '@mui/material'
import Box from '@mui/material/Box'
import CategoryRow from './CategoryRow'
import { unformat } from '../utils/moneyUtils'
import CssBaseline from '@mui/material/CssBaseline'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ArrowRightIcon from '@mui/icons-material/ArrowRight'
import Checkbox from '@mui/material/Checkbox'

// expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color: 'white' }} />}

const ExpandIconWithCheckbox = () => {
  const isGroup = true
  return (
        <IconButton sx={{ visibility: isGroup ? 'visible' : 'hidden' }} color="inherit">
        <ArrowRightIcon sx={{ color: 'black' }} onClick={() => { console.log('Going to toggle accordion') } } />
        </ IconButton>
  )
}

const AccordionSummary = ({ children }: any) => {
  return (
      <React.Fragment>
          <Box sx={{
            display: 'flex',
            padding: '0px'
          }}>
          <Checkbox />
    <MuiAccordionSummary
        expandIcon={<ExpandIconWithCheckbox />}
            sx={{
              flexDirection: 'row-reverse',
              '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                transform: 'rotate(90deg)'
              },
              '& .MuiButtonBase-root-MuiAccordionSummary-root': {
                // padding: '0px'
              }
            }}
        >
            {children}
    </MuiAccordionSummary>
          </Box>

      </React.Fragment>

  )
}

const AccordionDetails = ({ children }: any) => {
  return (
        <MuiAccordionDetails
          sx={{
            // borderTop: '1px solid rgba(0, 0, 0, .125)'
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
              }
            }}
          >
            {children}
          </MuiAccordion>
  )
}

const BudgetCategories = ({ categoryGroup, categories, setBudgetedById, setCategoryNameById, expanded, handleChange }: any) => {
  return (
    <React.Fragment>
    <CssBaseline />

                <CategoryRow
                    key={categoryGroup.id}
                    name={categoryGroup.name}
                    spent={categoryGroup.spent}
                    balance={categoryGroup.balance}
                    budgeted={categoryGroup.budgeted}
                    saveBudgetedAmount={v => setBudgetedById(categoryGroup.id, v)}
                    saveCategoryName={v => setCategoryNameById(categoryGroup.id, v)}
                    isGroup={true}
                    handleChange={handleChange} />
                {
                    expanded
                      ? categories.map(x => <CategoryRow
                        key={x.id}
                        name={x.name}
                        spent={x.spent}
                        balance={x.balance}
                        budgeted={x.budgeted}
                        saveBudgetedAmount={v => setBudgetedById(categoryGroup.id, v)}
                        saveCategoryName={v => setCategoryNameById(categoryGroup.id, v) }
                        isGroup={false}
                        handleChange={() => null}
                        />)
                      : null
                }
    </React.Fragment>
  )
}

export default BudgetCategories
