import React, { useState, useRef, useEffect } from 'react'
import Checkbox from '@mui/material/Checkbox'
import { IconButton, Typography, ButtonBase, TextField } from '@mui/material'
import Box from '@mui/material/Box'
import MoneyCell from './MoneyCell'
import CssBaseline from '@mui/material/CssBaseline'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline'
import ProgresBar from './ProgressBar'
import ArrowRight from '@mui/icons-material/ArrowRight'

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
  isGroup: Boolean,
  handleChange: Function,
  expanded: Boolean
}

const AddCategoryButton = ({ isGroup }: any) => {
  return (
    <IconButton color="inherit" sx={{ visibility: isGroup ? 'visible' : 'hidden' }}>
      < AddCircleOutlineIcon/>
    </IconButton>
  )
}

const CategoryNameUneditable = ({ name, onClickHandler }: any) => {
  return (
    <Box
      sx={{
        flexDirection: 'column',
        alignItems: 'flex-start',
        display: 'flex',
        width: 'fit-content',
        padding: '3px',
        '&:hover': {
        // cursor: 'text',
          textDecoration: 'underline'
        }
      }}
      onClick={onClickHandler}
      >
      <Box sx={{}}>
        <ButtonBase>
          <Typography align='left' sx={{ display: 'inline-block', overflow: 'hidden', whiteSpace: 'nowrap', textOverflow: 'ellipsis', maxWidth: '250px', verticalAlign: 'middle' }} variant='body1'>
            {name}
          </Typography>
        </ButtonBase>
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
    padding: '0px',
    marginTop: '5px',
    marginBottom: '5px',
    borderRadius: '8px',
    background: '#FFFFFF',
    '& .MuiInput-input': {
      padding: '2px'
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

const CategoryNameDisplay = ({ name, saveCategoryName, isGroup } : any) => {
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
    verticalAlign: 'middle'
    // border: '1px solid red'
  }

  return (
    <React.Fragment>
    <ClickAwayListener onClickAway={onClickAwayHandler}>
    <Box
      sx={{ ...style }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {
            (clicked)
              ? <CategoryNameEditable name={name} clicked={clicked} setClickedFalse={() => setClicked(false)} saveCategoryName={saveCategoryName} />
              : <CategoryNameUneditable onClickHandler={onClickHandler} name={name} />
          }
          { (!clicked) ? <AddCategoryButton isGroup={isGroup} /> : null }
        </Box>

        {!isGroup
          ? <Box sx={{ paddingBottom: '8px', width: '100%' }}>
          <ProgresBar value={60} />
        </Box>
          : null}

      </Box>
  </ClickAwayListener>
  </React.Fragment>
  )
}

const CategoryRow = ({ name, budgeted, spent, balance, saveBudgetedAmount, saveCategoryName, isGroup, handleChange, expanded }: CategoryRowProps) => {
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
        <Box sx={{
          display: 'inline-flex',
          flexGrow: 5,
          minWidth: '350px'
        }}>
          <Checkbox />
          <IconButton onClick={() => handleChange()} sx={{ visibility: isGroup ? 'visible' : 'hidden' }} color="inherit">
            <ArrowRight sx={{
              transform: expanded ? 'rotate(90deg)' : 'rotate(0deg)'
            }}/>
          </ IconButton>
          <CategoryNameDisplay name={name} isGroup={isGroup} saveCategoryName={saveCategoryName}/>
        </Box>
        <MoneyCell editable={true} colored={false} amount={budgeted} saveChangedAmount={saveBudgetedAmount}/>
        <MoneyCell editable={false} colored={false} amount={spent} saveChangedAmount={() => null}/>
        <MoneyCell editable={false} colored={true} amount={balance} saveChangedAmount={() => null} />
        </Box>
    </React.Fragment>
  )
}

export default CategoryRow
