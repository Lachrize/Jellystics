import { Box, Typography } from '@mui/material'
import LanguageSwitcher from '@/shared/components/LanguageSwitcher'

export default function AuthLogo() {
  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        mb: 3,
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <Box
          component="img"
          src="/logo.svg"
          alt="Jellyfin"
          sx={{ width: 40, height: 40, flexShrink: 0 }}
        />
        <Typography variant="h6" sx={{ fontWeight: 700, lineHeight: 1.2 }}>
          Jellystics
        </Typography>
      </Box>
      <LanguageSwitcher />
    </Box>
  )
}
