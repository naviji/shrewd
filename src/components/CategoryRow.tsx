import React, { useState, useRef, forwardRef, useEffect } from 'react'
import Checkbox from '@mui/material/Checkbox'
import { IconButton, Typography, ButtonBase, TextField } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Box from '@mui/material/Box'
import MoneyCell from './MoneyCell'
import CssBaseline from '@mui/material/CssBaseline'
import ClickAwayListener from '@mui/material/ClickAwayListener'

/*
  Text align and padding of input need to be done using global css styles.
  https://mui.com/api/input/
  https://mui.com/guides/interoperability/#global-css
  https://mui.com/customization/theme-components/#global-style-overrides
*/

interface CategoryRowProps {
  name: String,
  budgeted: number,
  spent: number,
  balance: number,
  saveBudgetedAmount: Function,
  saveCategoryName: Function,
  isGroup: Boolean
}

const CategoryNameUneditable = ({ name }: any) => {
  return (
    <ButtonBase>
      <Typography align='left' sx={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '250px', verticalAlign: 'middle' }} variant='body1'>
        {name}
      </Typography>
    </ButtonBase>
  )
}

const CategoryNameEditable = forwardRef((props: any, ref) => {
  const { name, setClickedFalse, saveCategoryName } = props
  const [tempName, setTempName] = useState(name)
  const inputRef = useRef(null)

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <Box
      component="form" noValidate
      autoComplete="off"
      sx={{
        '& > :not(style)': { m: 0 },
        display: 'inline-block',
        cursor: 'text',
        width: '300px'
      }}>
        <TextField variant="standard" margin="none" value={tempName}
            sx={{
              '& > input': {
                margin: '0px',
                paddingTop: 0,
                paddingBottom: 0
              },
              background: '#FFFFFF',
              borderRadius: '8px'
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTempName(event.target.value)
            }}
            onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                setClickedFalse()
                event.preventDefault()
              }
            }}
            inputRef={inputRef}
            onBlur={() => {
              saveCategoryName(tempName)
              setClickedFalse()
            }}
            style={{ width: '100%' }}
            InputProps={{
              disableUnderline: true
            }}
        />
    </Box>
  )
})
CategoryNameEditable.displayName = 'CategoryNameEditable'

const CategoryNameDisplay = ({ name, saveCategoryName } : any) => {
  const [clicked, setClicked] = useState(false)
  const [hoveredOver, setHoveredOver] = useState(false)
  const inputRef = useRef(null)

  const onClickHandler = () => {
    setClicked(true)
    // if (inputRef.current) {
    //   inputRef.current.select()
    // }
  }

  const onClickAwayHandler = () => {
    setClicked(false)
    // if (inputRef.current) {
    //   inputRef.current.select()
    // }
  }

  let style = {
    display: 'inline-block',
    verticalAlign: 'middle',
    '&:hover': {
      cursor: 'text',
      textDecoration: 'underline'
    }
  }

  const editableStyle = {
    border: 'solid #4495d7',
    borderRadius: '8px'
  }

  if (clicked) style = { ...style, ...editableStyle }

  return (
    <React.Fragment>
    <ClickAwayListener onClickAway={onClickAwayHandler}>
    <Box
      onClick={onClickHandler}
      onMouseEnter={() => setHoveredOver(true)}
      onMouseLeave={() => setHoveredOver(false)}
      sx={{ ...style }}>
        {
          (clicked)
            ? <CategoryNameEditable name={name} setClickedFalse={() => setClicked(false)} saveCategoryName={saveCategoryName} />
            : <CategoryNameUneditable name={name} />
        }
      </Box>
  </ClickAwayListener>
  </React.Fragment>
  )
}

const CategoryRow = ({ name, budgeted, spent, balance, saveBudgetedAmount, saveCategoryName, isGroup }: CategoryRowProps) => {
  const bgColor = isGroup ? '#F0F0F0' : '#FFFFFF'
  return (
    <React.Fragment>
    <CssBaseline />
    <Box sx={{
      display: 'flex',
      width: '100%',
      minWidth: '800px',
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      border: '1px solid rgba(186, 186, 186, 0.54)',
      background: bgColor
    }}>
        <Box sx={{ flexGrow: 5, minWidth: '350px' }}>
          <Checkbox />
          <IconButton sx={{ visibility: isGroup ? 'visible' : 'hidden' }} color="inherit">
            <ArrowDropDownIcon />
          </ IconButton>
          <CategoryNameDisplay name={name} saveCategoryName={saveCategoryName}/>
        </Box>
      <MoneyCell editable={true} colored={false} amount={budgeted} saveChangedAmount={saveBudgetedAmount}/>
      <MoneyCell editable={false} colored={false} amount={spent} saveChangedAmount={() => null}/>
      <MoneyCell editable={false} colored={true} amount={balance} saveChangedAmount={() => null} />
    </Box>
    </React.Fragment>
  )
}

export default CategoryRow
