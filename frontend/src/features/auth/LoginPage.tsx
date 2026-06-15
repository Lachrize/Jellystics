import { useEffect, useState } from 'react'
import {
  Box, Button, TextField, Typography,
  CircularProgress, Alert, Paper, Divider, Skeleton,
} from '@mui/material'
import AuthLogo from './AuthLogo'
import { useTranslation } from 'react-i18next'
import publicApi from '@/lib/publicApi'

export default function LoginPage() {
  const { t } = useTranslation()
  const [serverName, setServerName] = useState<string | null>(null)
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Fetch server name from config + check-server
  useEffect(() => {
    publicApi.get<{ jellyfinUrl?: string }>('/auth/isConfigured')
      .then(async (res) => {
        const url = res.data.jellyfinUrl
        if (!url) return
        try {
          const info = await publicApi.post<{ serverName: string }>('/auth/check-server', { url })
          setServerName(info.data.serverName)
        } catch {
          setServerName(url)
        }
      })
      .catch(() => {})
  }, [])

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!username.trim() || !password) return
    setError(null)
    setLoading(true)
    try {
      const res = await publicApi.post<{ token: string }>('/auth/jellyfin-login', {
        username,
        password,
      })
      localStorage.setItem('jellystics-token', res.data.token)
      localStorage.setItem('jellystics-username', username)
      window.location.href = '/'
    } catch (err: unknown) {
      const status = (err as { response?: { status?: number } })?.response?.status
      if (status === 403) setError(t('auth.adminRequired'))
      else if (status === 503) setError(t('auth.jellyfinUnreachable'))
      else setError(t('auth.invalidCredentials'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        bgcolor: 'background.default',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Box sx={{ width: '100%', maxWidth: 400 }}>
        <Paper
          sx={{
            width: '100%',
            pt: 2,
            px: 3,
            pb: 3,
            boxShadow: 'none',
            border: '1px solid',
            borderColor: 'divider',
            borderRadius: 1,
          }}
        >
          <AuthLogo />
          <Divider sx={{ mb: 3 }} />

          <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom>
            {t('auth.signIn')}
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2.5 }}>
            {serverName
              ? t('auth.connectedTo', { name: serverName })
              : <Skeleton width={180} />
            }
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          <Box
            component="form"
            onSubmit={handleSignIn}
            sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}
          >
            <TextField
              label={t('auth.username')}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              fullWidth
              autoFocus
              autoComplete="username"
              disabled={loading}
            />
            <TextField
              label={t('auth.password')}
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              fullWidth
              autoComplete="current-password"
              disabled={loading}
            />
            <Button
              type="submit"
              variant="contained"
              size="large"
              fullWidth
              disableElevation
              disabled={loading || !username.trim() || !password}
              sx={{ mt: 0.5 }}
            >
              {loading ? <CircularProgress size={22} color="inherit" /> : t('auth.signIn')}
            </Button>
          </Box>
        </Paper>

        <Box sx={{ mt: 2, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 0.75 }}>
          <Typography variant="caption" color="text.disabled" sx={{ fontWeight: 500 }}>
            {t('frame.poweredBy')}
          </Typography>
          <Box
            component="a"
            href="https://github.com/CyferShepard/jellystics"
            target="_blank"
            rel="noopener noreferrer"
            sx={{
              display: 'flex',
              alignItems: 'center',
              gap: 0.5,
              opacity: 0.4,
              transition: 'opacity 0.2s',
              textDecoration: 'none',
              '&:hover': { opacity: 1 },
              '& img': { filter: 'grayscale(100%) brightness(2)', transition: 'filter 0.2s' },
              '&:hover img': { filter: 'grayscale(100%) brightness(2)' },
            }}
          >
            <Box component="img" src="/logo.svg" alt="Jellystics" sx={{ width: 14, height: 14 }} />
            <Typography variant="caption" sx={{ fontWeight: 700, color: 'text.primary' }}>
              Jellystics
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}
