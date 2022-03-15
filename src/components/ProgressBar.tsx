import React from 'react'
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress'
import { styled } from '@mui/material/styles'
import { Box } from '@mui/system'

// const BorderLinearProgress = styled(LinearProgress)(({ theme }) => ({
//   height: 10,
//   borderRadius: 5,
//   [`&.${linearProgressClasses.colorPrimary}`]: {
//     backgroundColor: theme.palette.grey[theme.palette.mode === 'light' ? 200 : 800]
//   },
//   [`& .${linearProgressClasses.bar}`]: {
//     borderRadius: 5,
//     backgroundColor: theme.palette.mode === 'light' ? '#1a90ff' : '#308fe8'
//   }
// }))

const ProgresBar = ({ value }: any) => {
  return (
        <Box sx={{
          height: 10,
          borderRadius: 5,
          background: '#CDEA9F'
        }}>
            <LinearProgress
                variant="determinate"
                value={value}

            />
        </Box>
  )
}

export default ProgresBar
