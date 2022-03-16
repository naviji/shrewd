import React, { useState, useRef, useEffect } from 'react'
import Checkbox from '@mui/material/Checkbox'
import { IconButton, Typography, ButtonBase, TextField } from '@mui/material'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import Box from '@mui/material/Box'
import MoneyCell from './MoneyCell'
import CssBaseline from '@mui/material/CssBaseline'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ProgresBar from './ProgressBar'

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
    <Box sx={{ flexDirection: 'column', alignItems: 'flex-start', width: '100%', display: 'flex' }}>
      <Box sx={{ width: '100%' }}>
        <ButtonBase>
          <Typography align='left' sx={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '250px', verticalAlign: 'middle' }} variant='body1'>
            {name}
          </Typography>
        </ButtonBase>
      </Box>

      <Box sx={{ width: '100%' }}>
        <ProgresBar value={60} />
      </Box>

    </Box>

  )
}

const CategoryNameEditable = ({ name, clicked, setClickedFalse, saveCategoryName }: any) => {
  const [tempName, setTempName] = useState(name)
  const inputRef = useRef(null)

  let style = {
    '& > :not(style)': { m: 0 },
    display: 'inline-block',
    // cursor: 'text',
    width: '300px'
  }

  const editableStyle = {
    border: 'solid #4495d7',
    borderRadius: '8px',
    '& .MuiInput-input': {
      padding: '0px'
    }
  }

  if (clicked) style = { ...style, ...editableStyle }

  useEffect(() => {
    if (inputRef) {
      inputRef.current.focus()
    }
  }, [])

  return (
    <Box
      component="form" noValidate
      autoComplete="off"
      sx={{ ...style }}>
        <TextField variant="standard" margin="none" value={tempName}
            sx={{
              '& > input': {
                margin: '0px',
                paddingTop: 0,
                paddingBottom: 0
              },
              borderRadius: '8px'
            }}
            onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
              setTempName(event.target.value)
            }}
            onKeyPress={(event: React.KeyboardEvent<HTMLInputElement>) => {
              if (event.key === 'Enter') {
                setClickedFalse()
                saveCategoryName(tempName)
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
}

const CategoryNameDisplay = ({ name, saveCategoryName } : any) => {
  const [clicked, setClicked] = useState(false)

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

  const style = {
    width: '80%',
    display: 'inline-block',
    verticalAlign: 'middle',
    '&:hover': {
      // cursor: 'text',
      textDecoration: 'underline'
    }
  }

  return (
    <React.Fragment>
    <ClickAwayListener onClickAway={onClickAwayHandler}>
    <Box
      onClick={onClickHandler}
      sx={{ ...style }}>
        {
          (clicked)
            ? <CategoryNameEditable name={name} clicked={clicked} setClickedFalse={() => setClicked(false)} saveCategoryName={saveCategoryName} />
            : <CategoryNameUneditable name={name} />
        }
      </Box>
  </ClickAwayListener>
  </React.Fragment>
  )
}

const AddCategoryButton = () => {
  return (
    <IconButton color="inherit">
      < AddCircleOutlineIcon/>
    </IconButton>
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
        <Box sx={{ display: 'inline-flex', flexGrow: 5, minWidth: '350px' }}>
          <Checkbox />
          <IconButton sx={{ visibility: isGroup ? 'visible' : 'hidden' }} color="inherit">
            <ArrowDropDownIcon />
          </ IconButton>
          <CategoryNameDisplay name={name} saveCategoryName={saveCategoryName}/>
          { isGroup ? <AddCategoryButton /> : null }
        </Box>
      <MoneyCell editable={true} colored={false} amount={budgeted} saveChangedAmount={saveBudgetedAmount}/>
      <MoneyCell editable={false} colored={false} amount={spent} saveChangedAmount={() => null}/>
      <MoneyCell editable={false} colored={true} amount={balance} saveChangedAmount={() => null} />
    </Box>
    </React.Fragment>
  )
}

export default CategoryRow
