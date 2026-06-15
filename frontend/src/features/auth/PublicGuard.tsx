import { useEffect, useState } from 'react'
import { Navigate, Outlet, useLocation } from 'react-router-dom'
import { Box, CircularProgress } from '@mui/material'
import publicApi from '@/lib/publicApi'

type ConfigState = 0 | 1

export default function PublicGuard() {
  const [loading, setLoading] = useState(true)
  const [state, setState] = useState<ConfigState>(0)
  const location = useLocation()

  useEffect(() => {
    publicApi.get<{ state: ConfigState }>('/auth/isConfigured')
      .then((res) => setState(res.data.state))
      .catch(() => setState(0))
      .finally(() => setLoading(false))
  }, [])

  if (loading) {
    return (
      <Box sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: 'background.default' }}>
        <CircularProgress />
      </Box>
    )
  }

  // Configured and logged in → go home
  const token = localStorage.getItem('jellystics-token')
  if (state === 1 && token) return <Navigate to="/" replace />

  // Not configured but trying to access /login → redirect to setup
  if (state === 0 && location.pathname === '/login') return <Navigate to="/setup" replace />

  return <Outlet context={{ configState: state }} />
}
