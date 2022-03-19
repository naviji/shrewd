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
                    handleChange={handleChange}
                    expanded={expanded} />
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
                        expanded={expanded}
                        />)
                      : null
                }
    </React.Fragment>
  )
}

export default BudgetCategories
