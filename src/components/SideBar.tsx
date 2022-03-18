import React from 'react'
import Box from '@mui/material/Box'
import CssBaseline from '@mui/material/CssBaseline'

import SidebarButton from './SidebarButton'
import SidebarAccounts from './SidebarAccounts'

const SideBar = () => {
  return (
    <React.Fragment>
    <CssBaseline />
    <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          paddingLeft: '8px',
          paddingRight: '8px',
          width: 'fit-content',
          height: '100vh',
          border: '1px solid rgba(186, 186, 186, 0.54)',
          background: 'black'
        }}>
        <Box sx={{ flex: 1 }}>
            <Box sx={{
              display: 'flex',
              flexDirection: 'column'
            }}>
                <SidebarButton name="Budget" />
                <SidebarButton name="Accounts" />
                <SidebarButton name="Reports" />
                <SidebarAccounts />
            </Box>
        </Box>
        <Box sx={{ flex: 0, borderTop: '1px solid white' }}>
            <SidebarButton name="Synchronization" />
        </Box>
    </Box>
    </React.Fragment>
  )
}

export default SideBar
