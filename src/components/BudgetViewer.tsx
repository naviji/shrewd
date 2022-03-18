import React from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'

import CategoryHeader from './CategoryHeader'
import CategoryRow from './CategoryRow'

const BudgetViewer = ({ categories, setBudgetedById, setCategoryNameById }: any) => {
  const [expanded, setExpanded] = React.useState<Array<string>>([])

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, newExpanded: boolean) => {
      const idx = expanded.indexOf(panel)
      if (idx !== -1) {
        setExpanded(expanded.filter(x => x !== panel))
      } else {
        setExpanded(expanded.concat(panel))
      }
    }
  return (
    <React.Fragment>
    <CssBaseline />
    <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'flex-start',
          width: 'fit-content',
          height: '100vh'
        }}>
        <CategoryHeader />
        {
            categories.map(x => {
              return (
                    <CategoryRow
                        key={x.id}
                        name={x.name}
                        spent={x.spent}
                        balance={x.balance}
                        budgeted={x.budgeted}
                        saveBudgetedAmount={(v) => setBudgetedById(x.id, v)}
                        saveCategoryName={(v) => setCategoryNameById(x.id, v)}
                        isGroup={false} />
              )
            })
        }

    )
    </Box>
    </React.Fragment>
  )
}

export default BudgetViewer
