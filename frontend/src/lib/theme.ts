import { createTheme } from '@mui/material/styles'

const ACCENT_KEY = 'jellystics-accent-color'
const DEFAULT_ACCENT = '#a78bfa'

export function getAccentColor(): string {
  return localStorage.getItem(ACCENT_KEY) ?? DEFAULT_ACCENT
}

export function setAccentColor(color: string): void {
  localStorage.setItem(ACCENT_KEY, color)
}

export function buildTheme(accent: string = getAccentColor()) {
  return createTheme({
    palette: {
      mode: 'dark',
      background: {
        default: '#111114',
        paper: '#18181f',
      },
      primary: { main: accent },
      secondary: { main: '#7c3aed' },
      divider: 'rgba(255,255,255,0.08)',
      text: {
        primary: '#e8e8f0',
        secondary: '#8b8b9e',
      },
    },
    typography: {
      fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
      h4: { fontWeight: 600 },
      h5: { fontWeight: 600 },
      h6: { fontWeight: 600 },
    },
    shape: { borderRadius: 12 },
    components: {
      MuiCssBaseline: {
        styleOverrides: {
          body: { overscrollBehavior: 'none' },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: { textTransform: 'none', fontWeight: 500 },
        },
        defaultProps: {
          disableElevation: true,
        },
      },
      MuiListItemButton: {
        styleOverrides: {
          root: { borderRadius: 12 },
        },
      },
      MuiMenu: {
        styleOverrides: {
          paper: { borderRadius: '8px' },
          list: { padding: '4px 0' },
        },
        defaultProps: {
          slotProps: { paper: { elevation: 3 } },
        },
      },
      MuiMenuItem: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
            margin: '0px 4px',
            paddingLeft: '8px',
            paddingRight: '8px',
          },
        },
      },
      MuiTooltip: {
        defaultProps: { enterDelay: 500 },
      },
      MuiSkeleton: {
        defaultProps: { animation: 'wave' },
      },
      MuiDialogContent: {
        styleOverrides: {
          root: { paddingTop: 0 },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: 'rgba(255,255,255,0.08)' },
        },
      },
      MuiPaper: {
        styleOverrides: {
          root: { backgroundImage: 'none' },
        },
      },
      MuiTab: {
        styleOverrides: {
          root: { textTransform: 'none' },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: ({ theme }) => ({
            backgroundImage: 'none',
            boxShadow: 'none',
            border: `1px solid ${theme.palette.divider}`,
          }),
        },
      },
    },
  })
}

export const theme = buildTheme()
