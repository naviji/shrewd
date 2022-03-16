import React from 'react'
import LinearProgress from '@mui/material/LinearProgress'

const ProgresBar = ({ value }: any) => {
  return (

            <LinearProgress
                sx={{
                  height: 10,
                  borderRadius: 5,
                  backgroundColor: '#EAE9F0',
                  border: '1px solid rgb(186, 186, 186, 0.5)',
                  '& .MuiLinearProgress-bar': {
                    backgroundColor: '#219653'
                  }
                }}
                variant="determinate"
                value={value}
            />

  )
}

export default ProgresBar
