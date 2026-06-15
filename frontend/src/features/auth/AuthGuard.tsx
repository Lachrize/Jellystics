import { useEffect, useState } from 'react'
import { Navigate, Outlet } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import publicApi from '@/lib/publicApi'

type ConfigState = 0 | 1

async function fetchConfigState(): Promise<ConfigState> {
  try {
    const res = await publicApi.get<{ state: ConfigState }>('/auth/isConfigured')
    return res.data.state
  } catch {
    return 0
  }
}

export default function AuthGuard() {
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState<ConfigState>(0)

  useEffect(() => {
    fetchConfigState().then((s) => {
      setState(s)
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Jellyfin not configured yet → setup
  if (state === 0) return <Navigate to="/setup" replace />

  // Configured but not logged in → login
  const token = localStorage.getItem('jellystat-token')
  if (!token) return <Navigate to="/login" replace />

  return <Outlet />
}
