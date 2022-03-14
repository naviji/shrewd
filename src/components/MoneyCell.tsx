import React, { useState, forwardRef, useRef } from 'react'
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
    colored: Boolean;
    id: String
}

const MoneyInputCell = forwardRef((props: any, ref: any) => {
  const { id, setClickedFalse, tempAmount, setTempAmount } = props
  const dispatch = useDispatch()

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
              console.log(`Pressed keyCode ${event.key}`)
              if (event.key === 'Enter') {
                setClickedFalse()
                event.preventDefault()
              }
            }}
            inputRef={ref}
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

const MoneyCell = ({ id, amount, editable, colored }: MoneyCellProps) => {
  const [clicked, setClicked] = useState(false)
  const [hoveredOver, sethoveredOver] = useState(false)
  const [tempAmount, setTempAmount] = useState(format(amount).slice(1))
  const dispatch = useDispatch()

  const inputRef = useRef(null)
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

  let moneyCell = null
  if (hoveredOver || clicked) {
    moneyCell = <MoneyInputCell id={id} ref={inputRef} tempAmount={tempAmount} setTempAmount={(v) => setTempAmount(v)} setClickedFalse={() => setClicked(false)}/>
  } else {
    moneyCell = <MoneyDisplayCell amount={amount} colored={colored} />
  }

  const onClickAwayHandler = () => {
    console.log('Triggered because of click away', tempAmount)
    dispatch(setBudgeted({ categoryId: id, budgeted: unformat(tempAmount) }))
    setTempAmount(format(unformat(tempAmount)).slice(1))
    setClicked(false)
  }

  return (

        <React.Fragment>
          <CssBaseline />
          <ClickAwayListener onClickAway={onClickAwayHandler}>

      <Box
        onClick={() => {
          console.log('On click detected')
          if (editable) setClicked(true)
          if (inputRef.current) {
            console.log('inputRef current defined', inputRef.current)
            inputRef.current.select()
          }
        }}
        onMouseEnter={() => editable && sethoveredOver(true)}
        onMouseLeave={() => editable && sethoveredOver(false)}
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
            {moneyCell}
    </Box>
    </ClickAwayListener>

    </React.Fragment>
  )
}

export default MoneyCell
