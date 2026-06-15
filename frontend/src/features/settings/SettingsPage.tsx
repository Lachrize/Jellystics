import { useState } from 'react'
import { Box, Tabs, Tab } from '@mui/material'
import { useTranslation } from 'react-i18next'
import PageHeader from '@/shared/components/PageHeader/PageHeader'
import ConfigTab from './components/ConfigTab'
import TasksTab from './components/TasksTab'
import BackupTab from './components/BackupTab'
import WebhooksTab from './components/WebhooksTab'
import SecurityTab from './components/SecurityTab'
import LogsTab from './components/LogsTab'
import ApiKeysTab from './components/ApiKeysTab'

const TABS = [
  'settings.config',
  'settings.tasks',
  'settings.backup',
  'settings.webhooks',
  'settings.security',
  'settings.logs',
  'settings.apiKeys',
]

export default function SettingsPage() {
  const { t } = useTranslation()
  const [tab, setTab] = useState(0)

  return (
    <>
      <PageHeader title={t('nav.settings')} />
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto">
          {TABS.map((key) => (
            <Tab key={key} label={t(key)} />
          ))}
        </Tabs>
      </Box>
      {tab === 0 && <ConfigTab />}
      {tab === 1 && <TasksTab />}
      {tab === 2 && <BackupTab />}
      {tab === 3 && <WebhooksTab />}
      {tab === 4 && <SecurityTab />}
      {tab === 5 && <LogsTab />}
      {tab === 6 && <ApiKeysTab />}
    </>
  )
}
