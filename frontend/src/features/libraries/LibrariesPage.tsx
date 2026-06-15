import { useState, useEffect } from 'react'
import { Grid, Alert, Card, CardContent, CardActionArea, Typography, Chip, Skeleton, Box } from '@mui/material'
import { Library24Regular, VideoClip24Regular, MusicNote224Regular, Image24Regular } from '@fluentui/react-icons'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import PageHeader from '@/shared/components/PageHeader/PageHeader'
import api from '@/lib/axios'
import type { Library } from '@/shared/types/library'

function LibraryIcon({ type }: { type: string }) {
  if (type === 'music') return <MusicNote224Regular style={{ fontSize: 32 }} />
  if (type === 'movies' || type === 'tvshows') return <VideoClip24Regular style={{ fontSize: 32 }} />
  if (type === 'photos') return <Image24Regular style={{ fontSize: 32 }} />
  return <Library24Regular style={{ fontSize: 32 }} />
}

export default function LibrariesPage() {
  const { t } = useTranslation()
  const navigate = useNavigate()
  const [libraries, setLibraries] = useState<Library[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    api.get('/stats/getLibraries').then((r) => setLibraries(r.data ?? [])).catch(() => setError(t('common.loadError'))).finally(() => setLoading(false))
  }, [t])

  return (
    <>
      <PageHeader title={t('nav.libraries')} />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
      <Grid container spacing={2}>
        {loading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Grid key={i} size={{ xs: 12, sm: 6, md: 4 }}>
                <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 1 }} />
              </Grid>
            ))
          : libraries.map((lib) => (
              <Grid key={lib.Id} size={{ xs: 12, sm: 6, md: 4 }}>
                <Card sx={{ height: '100%' }}>
                  <CardActionArea onClick={() => navigate(`/libraries/${lib.Id}`)} sx={{ height: '100%' }}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 1.5 }}>
                        <Box sx={{ color: 'primary.main' }}><LibraryIcon type={lib.CollectionType} /></Box>
                        <Chip label={lib.CollectionType} size="small" sx={{ fontSize: 11, height: 20, textTransform: 'capitalize' }} />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700 }} gutterBottom noWrap>{lib.Name}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {lib.ItemCount.toLocaleString()} {t('common.items')}
                        {lib.EpisodeCount && ` · ${lib.EpisodeCount.toLocaleString()} ${t('common.episodes')}`}
                      </Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            ))}
      </Grid>
    </>
  )
}
