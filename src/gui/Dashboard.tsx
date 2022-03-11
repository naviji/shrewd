import * as React from 'react'
import { styled, createTheme, ThemeProvider, alpha } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import MuiDrawer from '@mui/material/Drawer'
import Box from '@mui/material/Box'
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar'
import Toolbar from '@mui/material/Toolbar'
import List from '@mui/material/List'
import Typography from '@mui/material/Typography'
import Divider from '@mui/material/Divider'
import IconButton from '@mui/material/IconButton'
import Badge from '@mui/material/Badge'
import Container from '@mui/material/Container'
import Grid from '@mui/material/Grid'
import Paper from '@mui/material/Paper'
import Link from '@mui/material/Link'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import UndoIcon from '@mui/icons-material/Undo'
import RedoIcon from '@mui/icons-material/Redo'
import HistoryIcon from '@mui/icons-material/History'
import { mainListItems, secondaryListItems } from './listItems'
import Chart from './Chart'
import Deposits from './Deposits'
import Orders from './Orders'
import { blue, green } from '@mui/material/colors'
import Button from '@mui/material/Button'
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined'
import ArrowDropDownCircleOutlinedIcon from '@mui/icons-material/ArrowDropDownCircleOutlined'
import ArrowLeftOutlinedIcon from '@mui/icons-material/ArrowLeftOutlined'
import ArrowRightOutlinedIcon from '@mui/icons-material/ArrowRightOutlined'
import InputBase from '@mui/material/InputBase'
import SearchIcon from '@mui/icons-material/Search'

function Copyright (props: any) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  )
}

const drawerWidth: number = 240

interface AppBarProps extends MuiAppBarProps {
  open?: boolean;
}

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open'
})<AppBarProps>(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}))

const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    '& .MuiDrawer-paper': {
      position: 'relative',
      whiteSpace: 'nowrap',
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen
      }),
      boxSizing: 'border-box',
      ...(!open && {
        overflowX: 'hidden',
        transition: theme.transitions.create('width', {
          easing: theme.transitions.easing.sharp,
          duration: theme.transitions.duration.leavingScreen
        }),
        width: theme.spacing(7),
        [theme.breakpoints.up('sm')]: {
          width: theme.spacing(9)
        }
      })
    }
  })
)

const mdTheme = createTheme({
  palette: {
    primary: {
      main: '#ffffff'
    },
    secondary: {
      main: '#014ede'
    },
    background: {
      default: '#f1f1f1'
    }
  }
})

function DashboardContent () {
  const [open, setOpen] = React.useState(true)
  const toggleDrawer = () => {
    setOpen(!open)
  }

  return (
      <Box sx={{ display: 'flex', overflow: 'hidden' }}>
        <CssBaseline />

        <AppBar position="absolute" open={open}>
          <Toolbar>
            <IconButton color="inherit">
                <UndoIcon />
            </IconButton>
            <IconButton color="inherit">
                <RedoIcon />
            </IconButton>
            <IconButton color="inherit">
                <HistoryIcon />
            </IconButton>

            <Button variant="contained" disableElevation endIcon={<ArrowDropDownCircleOutlinedIcon />} color='success'>
              $ 123,456,789.00
            </Button>

            <Button variant="contained" disableElevation startIcon={<ArrowLeftOutlinedIcon />} endIcon={<ArrowRightOutlinedIcon />} color='primary'>
              SEP 2022
            </Button>

          </Toolbar>
        </AppBar>

        <Drawer variant="permanent" open={open}>

          <Divider />
          <List component="nav">
            {mainListItems}
            <Divider sx={{ my: 1 }} />
            {secondaryListItems}
          </List>
        </Drawer>
        <Box
          component="main"
          sx={{
            backgroundColor: (theme) =>
              theme.palette.mode === 'light'
                ? theme.palette.grey[100]
                : theme.palette.grey[900],
            flexGrow: 1,
            height: '100vh',
            overflow: 'auto'
          }}
        >
          <Toolbar />
          <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
            <Grid container spacing={3}>
              {/* Chart */}
              <Grid item xs={12} md={8} lg={9}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240
                  }}
                >
                  <Chart />
                </Paper>
              </Grid>
              {/* Recent Deposits */}
              <Grid item xs={12} md={4} lg={3}>
                <Paper
                  sx={{
                    p: 2,
                    display: 'flex',
                    flexDirection: 'column',
                    height: 240
                  }}
                >
                  <Deposits />
                </Paper>
              </Grid>
              {/* Recent Orders */}
              <Grid item xs={12}>
                <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column' }}>
                  <Orders />
                </Paper>
              </Grid>
            </Grid>
            <Copyright sx={{ pt: 4 }} />
          </Container>
        </Box>
      </Box>
  )
}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  color: theme.palette.text.secondary
}))

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  border: '1px solid',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.25)
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: {
    marginLeft: theme.spacing(3),
    width: 'auto'
  }
}))

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
}))

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '20ch'
    }
  }
}))

export function BudgetDisplay () {
  return (
  <Box sx={{ display: 'flex', width: '100%', flexDirection: 'column' }}>
    <Box sx={{ dislplay: 'flex', border: '1px solid grey', justifyContent: 'space-between' }}>
      <Toolbar>
      <IconButton color="inherit">
            <UndoIcon />
        </IconButton>

        <IconButton color="inherit">
            <RedoIcon />
        </IconButton>

        <IconButton color="inherit">
            <HistoryIcon />
        </IconButton>

        <Button variant="contained" color="success" disableElevation endIcon={<ArrowDropDownCircleOutlinedIcon />}>
          <Typography variant="h6" component="h6" >
          $ 123,456,789.00
          </Typography>
        </Button>

        <Button variant="contained" disableElevation startIcon={<ArrowLeftOutlinedIcon fontSize='large' />} endIcon={<ArrowRightOutlinedIcon />} color='primary'>

          <Typography variant="h6" component="h6" >
          SEP 2022
          </Typography>
        </Button>

        <InputBase
        sx={{ ml: 1, flex: 1, border: '1px solid', borderRadius: '6px' }}
        placeholder="Filter categories"
        inputProps={{ 'aria-label': 'filter categories' }}
      />
      <IconButton type="submit" sx={{ p: '10px' }} aria-label="search">
        <SearchIcon />
      </IconButton>
      </Toolbar>

    </Box>
    <Box sx={{ flexGrow: 1, display: 'flex', width: '100%' }}>
      <Box sx={{ flexGrow: 2, alignItems: 'stretch', minWidth: '500px' }}>
            <Item sx={{ height: '100%' }}>

            {/* <Container maxWidth="lg" sx={{ }}> */}
                <Paper sx={{ display: 'flex', height: '100%', overflow: 'scroll', minWidth: '600px', flexDirection: 'column' }}>
                  <Orders />
                  <p>test</p>
                </Paper>
          {/* </Container> */}

            </Item>
      </Box>
      <Box sx={{ minWidth: '250px' }}>
            <Item sx={{ height: '100%' }}>Inspector</Item>
    </Box>
  </Box>
  </Box>

  //   <Box sx={{ flexGrow: 1 }}>
  // <Grid container spacing={1}>,
  //       <Grid item xs={12}>
  //         <Item>Tool Bar</Item>
  //       </Grid>
  //       <Grid item xs={8} sx={{ border: '2px dashed red' }}>
  //         <Item>Categories</Item>
  //       </Grid>
  //       <Grid item xs={4} sx={{ border: '2px dashed blue' }}>
  //         <Item>Inspector</Item>
  //       </Grid>
  //     </Grid>

  //   </Box>

  )
}

export function SideBar () {
  const [open, setOpen] = React.useState(true)
  return (
    <Drawer variant="permanent" open={open}>
    <Divider />
    <List component="nav">
      {mainListItems}
      <Divider sx={{ my: 1 }} />
      {secondaryListItems}
    </List>
  </Drawer>
  )
}

export default function Dashboard () {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <SideBar />
      <BudgetDisplay />
    </Box>
  )
}
