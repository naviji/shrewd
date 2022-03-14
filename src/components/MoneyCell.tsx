import React, { useState, forwardRef, useRef } from 'react'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import ClickAwayListener from '@mui/material/ClickAwayListener'

import { format, unformat } from '../utils/moneyUtils'

import { Typography } from '@mui/material'

import CssBaseline from '@mui/material/CssBaseline'

interface MoneyCellProps {
    amount: number;
    editable: Boolean;
    colored: Boolean;
    saveChangedAmount: Function;
}

const MoneyInputCell = forwardRef((props: any, ref: any) => {
  const { setClickedFalse, tempAmount, setTempAmount, saveAmount } = props
  return (
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
              if (event.key === 'Enter') {
                setClickedFalse()
                event.preventDefault()
              }
            }}
            inputRef={ref}
            onBlur={(e) => {
              saveAmount(unformat(tempAmount))
              setClickedFalse()
            }}
            InputProps={{
              disableUnderline: true
            }}
        />
    </Box>
  )
})
MoneyInputCell.displayName = 'MoneyInputCell'

const MoneyColoredDisplayCell = ({ amount }: any) => {
  let backgroundColor = '#CDEA9F'
  if (amount < 0) {
    backgroundColor = '#FF7474'
  }
  const coloredStyle = {
    borderRadius: '16px',
    background: backgroundColor
  }

  return (
    <Box sx={{ ...coloredStyle }}>
      <Typography align='right' variant='body1' noWrap sx={{
        display: 'inline-block',
        height: '100%',
        width: '100%',
        verticalAlign: 'middle'
      }}>
            {format(amount)}
      </Typography>
    </Box>

  )
}

const MoneyUneditableDisplayCell = ({ amount }: any) => {
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

const MoneyDisplayCell = ({ amount, colored }: any) => {
  let displayCell = null

  displayCell = colored ? <MoneyColoredDisplayCell amount={amount} /> : <MoneyUneditableDisplayCell amount={amount} />

  return (
    <Box sx={{ }}>
      { displayCell }
    </Box>
  )
}

const editableStyle = {
  '&:hover': {
    cursor: 'text',
    border: 'solid #4495d7',
    borderRadius: '8px'
  }
}

const clickedStyle = {
  border: 'solid #4495d7',
  borderRadius: '8px'
}

const MoneyCell = ({ amount, editable, colored, saveChangedAmount }: MoneyCellProps) => {
  const [clicked, setClicked] = useState(false)
  const [hoveredOver, sethoveredOver] = useState(false)
  const [tempAmount, setTempAmount] = useState(format(amount).slice(1))

  const inputRef = useRef(null)

  let style = {
    display: 'inline-block',
    width: '120px',
    height: '100%',
    verticalAlign: 'middle',
    textAlign: 'right',
    paddingLeft: '8px',
    paddingRight: '8px',
    border: 'solid white'
  }
  if (editable) style = Object.assign(style, editableStyle) // move to editable component?
  if (clicked) style = Object.assign(style, clickedStyle)

  let moneyCell = null
  if (hoveredOver || clicked) {
    moneyCell = <MoneyInputCell
      ref={inputRef}
      tempAmount={tempAmount}
      setTempAmount={(v) => setTempAmount(v)}
      setClickedFalse={() => setClicked(false)}
      saveAmount={(value) => saveChangedAmount(value)}
    />
  } else {
    moneyCell = <MoneyDisplayCell amount={amount} colored={colored} />
  }

  const onClickAwayHandler = () => {
    saveChangedAmount(unformat(tempAmount))
    setTempAmount(format(unformat(tempAmount)).slice(1))
    setClicked(false)
  }

  const onClickHandler = () => {
    if (editable) setClicked(true)
    if (inputRef.current) {
      inputRef.current.select()
    }
  }

  return (
  <React.Fragment>
    <CssBaseline />
    <ClickAwayListener onClickAway={onClickAwayHandler}>

    <Box
      onClick={onClickHandler}
      onMouseEnter={() => editable && sethoveredOver(true)}
      onMouseLeave={() => editable && sethoveredOver(false)}
      sx={{
        ...style
      }}>
          {moneyCell}
    </Box>
  </ClickAwayListener>
  </React.Fragment>
  )
}

export default MoneyCell
