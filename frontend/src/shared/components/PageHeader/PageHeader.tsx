import { Box, Typography, IconButton, Tooltip } from '@mui/material'
import { ArrowSync24Regular } from '@fluentui/react-icons'

interface PageHeaderProps {
  title: string
  actions?: React.ReactNode
  onRefresh?: () => void
  loading?: boolean
}

export default function PageHeader({ title, actions, onRefresh, loading }: PageHeaderProps) {
  return (
    <Box sx={{ mb: 4, display: 'flex', alignItems: 'center' }}>
      <Typography variant="h4" sx={{ fontWeight: 600 }}>
        {title}
      </Typography>
      {onRefresh && (
        <Tooltip title="Refresh">
          <IconButton onClick={onRefresh} disabled={loading} sx={{ ml: 1 }}>
            <ArrowSync24Regular />
          </IconButton>
        </Tooltip>
      )}
      <Box sx={{ flexGrow: 1 }} />
      {actions && actions}
    </Box>
  )
}
