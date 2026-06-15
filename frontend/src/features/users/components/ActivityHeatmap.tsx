import { Box, Tooltip, Typography } from '@mui/material'
import { useTheme } from '@mui/material/styles'
import { useTranslation } from 'react-i18next'
import type { UserActivity } from '@/shared/types/user'

interface ActivityHeatmapProps {
  data: UserActivity[]
}

const WEEKS = 52
const DAYS = 7

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return { r, g, b }
}

export default function ActivityHeatmap({ data }: ActivityHeatmapProps) {
  const theme = useTheme()
  const { t } = useTranslation()

  const dataMap = new Map(data.map((d) => [d.date, d.count]))
  const maxCount = Math.max(...data.map((d) => d.count), 1)

  const today = new Date()
  const startDate = new Date(today)
  startDate.setDate(startDate.getDate() - WEEKS * DAYS)

  const days: { date: string; count: number }[] = []
  for (let i = 0; i < WEEKS * DAYS; i++) {
    const d = new Date(startDate)
    d.setDate(startDate.getDate() + i)
    const key = d.toISOString().split('T')[0]
    days.push({ date: key, count: dataMap.get(key) ?? 0 })
  }

  const { r, g, b } = hexToRgb(theme.palette.primary.main)

  const CELL = 12
  const GAP = 2

  return (
    <Box>
      <Typography variant="subtitle2" sx={{ fontWeight: 600 }} gutterBottom>
        {t('users.activityHeatmap')}
      </Typography>
      <Box sx={{ overflowX: 'auto', pb: 1 }}>
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: `repeat(${WEEKS}, ${CELL}px)`,
            gridTemplateRows: `repeat(${DAYS}, ${CELL}px)`,
            gridAutoFlow: 'column',
            gap: `${GAP}px`,
            width: 'fit-content',
          }}
        >
          {days.map(({ date, count }) => {
            const intensity = count > 0 ? Math.min(count / maxCount, 1) : 0
            const opacity = count > 0 ? 0.15 + intensity * 0.85 : 0.06
            return (
              <Tooltip key={date} title={`${date}: ${count} ${t('common.plays')}`} arrow>
                <Box
                  sx={{
                    width: CELL,
                    height: CELL,
                    borderRadius: 0.5,
                    bgcolor: `rgba(${r},${g},${b},${opacity})`,
                    cursor: 'pointer',
                    transition: 'transform 0.1s',
                    '&:hover': { transform: 'scale(1.3)' },
                  }}
                />
              </Tooltip>
            )
          })}
        </Box>
      </Box>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
        <Typography variant="caption" color="text.secondary">{t('common.less')}</Typography>
        {[0.06, 0.3, 0.55, 0.8, 1].map((op) => (
          <Box key={op} sx={{ width: CELL, height: CELL, borderRadius: 0.5, bgcolor: `rgba(${r},${g},${b},${op})` }} />
        ))}
        <Typography variant="caption" color="text.secondary">{t('common.more')}</Typography>
      </Box>
    </Box>
  )
}
