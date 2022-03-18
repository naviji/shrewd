import React, { useState } from 'react'
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp'
import MuiAccordion from '@mui/material/Accordion'
import MuiAccordionSummary from '@mui/material/AccordionSummary'
import MuiAccordionDetails from '@mui/material/AccordionDetails'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import { ButtonBase } from '@mui/material'
import CategoryRow from './CategoryRow'
import { unformat } from '../utils/moneyUtils'
import CssBaseline from '@mui/material/CssBaseline'

// expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem', color: 'white' }} />}

const AccordionSummary = ({ children }: any) => {
  return (
        <Box
            sx={{
              flexDirection: 'row-reverse',
              '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
                transform: 'rotate(90deg)'
              }
            }}
        >
        {children}
        </Box>
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
            <Accordion panel={categoryGroup.id} expanded={expanded} handleChange={handleChange}>
                <AccordionSummary>
                <CategoryRow
                    key={categoryGroup.id}
                    name={categoryGroup.name}
                    spent={categoryGroup.spent}
                    balance={categoryGroup.balance}
                    budgeted={categoryGroup.budgeted}
                    saveBudgetedAmount={v => setBudgetedById(categoryGroup.id, v)}
                    saveCategoryName={v => setCategoryNameById(categoryGroup.id, v)}
                    isGroup={true} />
                </AccordionSummary>
                <AccordionDetails>
                {
                    categories.map(x => <CategoryRow
                        key={x.id}
                        name={x.name}
                        spent={x.spent}
                        balance={x.balance}
                        budgeted={x.budgeted}
                        saveBudgetedAmount={v => setBudgetedById(categoryGroup.id, v)}
                        saveCategoryName={v => setCategoryNameById(categoryGroup.id, v) }
                        isGroup={false} />)
                }
                </AccordionDetails>
            </Accordion>
    </React.Fragment>
  )
}

export default BudgetCategories
