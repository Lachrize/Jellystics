import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
  Grid, Alert, Card, CardContent, Typography, Tabs, Tab, Box,
  Chip, List, ListItem, ListItemText, Skeleton,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { format, parseISO } from 'date-fns'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import PageHeader from '@/shared/components/PageHeader/PageHeader'
import StatCard from '@/shared/components/StatCard/StatCard'
import ChartCard from '@/shared/components/ChartCard/ChartCard'
import DataTable from '@/shared/components/DataTable/DataTable'
import { createColumnHelper, type ColumnDef } from '@tanstack/react-table'
import api from '@/lib/axios'
import type { LibraryItem, LibraryStats, GenreStat } from '@/shared/types/library'
import { Play24Regular, Clock24Regular, Star24Regular } from '@fluentui/react-icons'

const COLORS = ['#a78bfa', '#7c3aed', '#6d28d9', '#5b21b6', '#4c1d95', '#8b5cf6', '#c4b5fd']
const col = createColumnHelper<LibraryItem>()

export default function LibraryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { t } = useTranslation()
  const [tab, setTab] = useState(0)
  const [items, setItems] = useState<LibraryItem[]>([])
  const [stats, setStats] = useState<LibraryStats | null>(null)
  const [genres, setGenres] = useState<GenreStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!id) return
    setLoading(true)
    Promise.all([
      api.get(`/stats/getLibraryStats?libraryId=${id}`),
      api.get(`/stats/getLibraryItems?libraryId=${id}`),
      api.get(`/stats/getGenreStats?libraryId=${id}`),
    ])
      .then(([statsRes, itemsRes, genresRes]) => {
        setStats(statsRes.data)
        setItems(itemsRes.data ?? [])
        setGenres(genresRes.data ?? [])
      })
      .catch(() => setError(t('common.loadError')))
      .finally(() => setLoading(false))
  }, [id, t])

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const columns: ColumnDef<LibraryItem, any>[] = [
    col.accessor('Name', { header: t('library.itemName') }),
    col.accessor('ProductionYear', { header: t('library.year'), cell: (i) => (i.getValue() as number | undefined) ?? '—' }),
    col.accessor('PlayCount', { header: t('library.plays') }),
    col.accessor('CommunityRating', {
      header: t('library.rating'),
      cell: (i) => { const v = i.getValue() as number | undefined; return v ? `★ ${v.toFixed(1)}` : '—' },
    }),
    col.accessor('LastPlayed', {
      header: t('library.lastPlayed'),
      cell: (i) => {
        const v = i.getValue() as string | undefined
        if (!v) return '—'
        try { return format(parseISO(v), 'dd/MM/yyyy') } catch { return v }
      },
    }),
  ]

  return (
    <>
      <PageHeader title={stats?.MostPlayedItem?.Name ?? (id ?? '')} />
      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label={t('stats.totalItems')} value={stats?.TotalItems ?? '—'} icon={<Play24Regular />} loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label={t('stats.totalPlays')} value={stats?.TotalPlayCount ?? '—'} icon={<Play24Regular />} loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label={t('stats.watchTime')} value={stats ? `${Math.floor((stats.TotalWatchTime ?? 0) / 60)}h` : '—'} icon={<Clock24Regular />} loading={loading} />
        </Grid>
        <Grid size={{ xs: 6, md: 3 }}>
          <StatCard label={t('library.topItem')} value={stats?.MostPlayedItem?.Name ?? '—'} icon={<Star24Regular />} loading={loading} />
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v as number)}>
          <Tab label={t('library.items')} />
          <Tab label={t('library.genres')} />
        </Tabs>
      </Box>

      {tab === 0 && <DataTable data={items} columns={columns} loading={loading} />}

      {tab === 1 && (
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, md: 6 }}>
            <ChartCard title={t('library.genreDistribution')} loading={loading} height={320}>
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={genres} dataKey="Count" nameKey="Genre" cx="50%" cy="50%" outerRadius={120} label={true}>
                    {genres.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </ChartCard>
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }} gutterBottom>{t('library.genreList')}</Typography>
                {loading ? (
                  Array.from({ length: 8 }).map((_, i) => <Skeleton key={i} variant="text" sx={{ mb: 0.5 }} />)
                ) : (
                  <List dense disablePadding>
                    {genres.map((g) => (
                      <ListItem key={g.Genre} disablePadding sx={{ py: 0.25 }}>
                        <ListItemText primary={g.Genre} slotProps={{ primary: { style: { fontSize: 13 } } }} />
                        <Chip label={g.Count} size="small" sx={{ fontSize: 11, height: 20 }} />
                      </ListItem>
                    ))}
                  </List>
                )}
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      )}
    </>
  )
}
