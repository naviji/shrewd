
import React, { useState } from 'react'
import { Typography, ButtonBase } from '@mui/material'
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'

const SidebarButton = ({ name }: any) => {
  const [hover, setHover] = useState(false)
  return (
      <ButtonBase
        onMouseEnter={() => setHover(true)}
        onMouseLeave={() => setHover(false)}
        sx={{
          display: 'flex',
          minWidth: '200px',
          marginTop: '8px',
          width: '100%',
          height: '40px',
          borderRadius: '10px',
          padding: '8px',
          background: hover ? '#ffffff' : '#000000',
          color: hover ? 'black' : 'white'
        }} >
        <AccountBalanceWalletIcon sx={{
          color: hover ? 'black' : 'white'
        }} />

        <Typography align='left' variant='body1' noWrap
        sx={{
          justifyContent: 'flex-start',
          display: 'inline-block',
          verticalAlign: 'middle',
          textAlign: 'left',
          background: hover ? '#ffffff' : '#000000',
          color: hover ? 'black' : 'white',
          width: '100%',
          padding: '4px',
          overflow: 'visible',
          '& .MuiTypography-body1': {
            width: 'fit-content',
            paddingTop: '0px',
            paddingBottom: '0px',
            background: '#000000',
            border: 'solid yellow'
          }
        }}>
        {name}
        </Typography>

        <AddCircleOutlineIcon sx={{
          color: hover ? 'black' : 'white',
          visibility: 'hidden'
        }} />
    </ButtonBase>
  )
}

export default SidebarButton
