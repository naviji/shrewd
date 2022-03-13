import React, { useState } from 'react'
import { useDispatch } from 'react-redux'

import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import ClickAwayListener from '@mui/material/ClickAwayListener'

import { format, unformat } from '../utils/moneyUtils'

import { Typography } from '@mui/material'

import CssBaseline from '@mui/material/CssBaseline'

import { setBudgeted } from '../lib/store'

interface MoneyCellProps {
    amount: number;
    editable: Boolean;
    id: String
}

const MoneyInputCell = ({ id, amount, setClickedFalse }: any) => {
  const [tempAmount, setTempAmount] = useState(format(amount).slice(1))
  const dispatch = useDispatch()
  const onClickAwayHandler = () => {
    console.log('Triggered because of click away', tempAmount)
    dispatch(setBudgeted({ categoryId: id, budgeted: unformat(tempAmount) }))
    setClickedFalse()
  }
  return (
      <ClickAwayListener onClickAway={onClickAwayHandler}>
        <Box component="form" noValidate autoComplete="off"
                    sx={{ '& > :not(style)': { m: 0 }, display: 'inline-block' }}>
                        {/* TODO: Find a way to remove padding of input element of this text field */}
                    <TextField variant="standard" margin="none" value={tempAmount}
                        sx={{
                          '& > input': {
                            margin: '0px',
                            paddingTop: 0,
                            paddingBottom: 0
                          }
                        }}
                        onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                          setTempAmount(event.target.value)
                        }}
                        onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
                          console.log(`Pressed keyCode ${event.key}`)
                          if (event.key === 'Enter') {
                            setClickedFalse()
                            event.preventDefault()
                          }
                        }}

                        onBlur={(e) => {
                          console.log('Triggered because this input lost focus', tempAmount)
                          dispatch(setBudgeted({ categoryId: id, budgeted: unformat(tempAmount) }))
                          setClickedFalse()
                        }}
                        InputProps={{
                          disableUnderline: true,
                          style: {
                            margin: '0',
                            padding: '0'
                          }
                        }}
                    />
                </Box>
      </ClickAwayListener>

  )
}

const MoneyDisplayCell = ({ amount }: any) => {
  return (
        <Typography align='right' variant='body1' noWrap sx={{
          display: 'inline-block',
          height: '100%',
          width: '100%',
          verticalAlign: 'middle'
        }}>
              {format(amount)}
        </Typography>
  )
}

const MoneyCell = ({ id, amount, editable }: MoneyCellProps) => {
  const [clicked, setClicked] = useState(false)
  const editableStyle = editable
    ? {
        '&:hover': {
          cursor: 'text',
          border: 'solid #4495d7',
          borderRadius: '8px'
        }
      }
    : {}
  const clickedStyle = clicked
    ? {
        border: 'solid #4495d7',
        borderRadius: '8px'
      }
    : {}
  return (

        <React.Fragment>
          <CssBaseline />
      <Box onClick={() => editable && setClicked(true)}
        sx={{
          display: 'inline-block',
          width: '120px',
          height: '100%',
          verticalAlign: 'middle',
          textAlign: 'right',
          paddingLeft: '8px',
          paddingRight: '8px',
          border: 'solid white',
          ...editableStyle,
          ...clickedStyle
        }}>
            {
                clicked ? <MoneyInputCell id={id} amount={amount} setClickedFalse={() => setClicked(false)}/> : <MoneyDisplayCell amount={amount} />
            }
    </Box>
    </React.Fragment>
  )
}

export default MoneyCell
