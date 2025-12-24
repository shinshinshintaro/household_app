import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { Home } from './pages/Home'

const theme = createTheme({})

export default function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        <Home />
    </ThemeProvider>
  )
}
