import { useEffect, useState } from 'react';
import { Box, Typography, Card, TextField, Button, Table, TableBody, TableCell, TableHead, TableRow } from '@mui/material';
import { api } from '../../api/client';
import dayjs from 'dayjs';

export default function DailyUpdatesAdmin() {
  const [date, setDate] = useState(dayjs().format('YYYY-MM-DD'));
  const [updates, setUpdates] = useState<Record<string, unknown>[]>([]);
  const [blockers, setBlockers] = useState<Record<string, unknown>[]>([]);
  const [submissionStatus, setSubmissionStatus] = useState<{ submittedUserIds?: string[] } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setError(null);
    try {
      const results = await Promise.allSettled([
        api.get('/daily-updates/admin', { params: { date } }),
        api.get('/daily-updates/admin/submission-status', { params: { date } }),
        api.get('/daily-updates/admin/blockers', {
          params: {
            from: dayjs(date).subtract(7, 'day').format('YYYY-MM-DD'),
            to: date,
          },
        }),
      ]);

      const [updatesRes, statusRes, blockersRes] = results;

      if (updatesRes.status === 'fulfilled') {
        setUpdates(Array.isArray(updatesRes.value.data) ? updatesRes.value.data : []);
      } else {
        console.error('Failed to load updates:', updatesRes.reason);
      }

      if (statusRes.status === 'fulfilled') {
        setSubmissionStatus(statusRes.value.data);
      } else {
        console.error('Failed to load status:', statusRes.reason);
      }

      if (blockersRes.status === 'fulfilled') {
        setBlockers(Array.isArray(blockersRes.value.data) ? blockersRes.value.data : []);
      } else {
        console.error('Failed to load blockers:', blockersRes.reason);
      }
    } catch (err) {
      console.error('Unexpected error loading dashboard:', err);
      setError('Failed to load dashboard data. Please try again.');
    }
  };

  useEffect(() => {
    load();
  }, [date]);

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Daily updates
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
        <TextField type="date" size="small" label="Date" value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />
        <Button variant="contained" onClick={load}>Refresh</Button>
      </Box>
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>
      )}
      {submissionStatus && (
        <Card sx={{ mb: 2 }}>
          <Box sx={{ p: 2 }}>
            <Typography variant="subtitle2">Submitted: {submissionStatus.submittedUserIds?.length ?? 0} users</Typography>
          </Box>
        </Card>
      )}
      <Card sx={{ mb: 2 }}>
        <Typography variant="h6" sx={{ p: 2 }}>Updates for {date}</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Completed</TableCell>
              <TableCell>In progress</TableCell>
              <TableCell>Blockers</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {updates.map((u: Record<string, unknown>, i: number) => (
              <TableRow key={i}>
                <TableCell>{(u.userId as { name?: string })?.name}</TableCell>
                <TableCell>{(u.projectId as { name?: string })?.name}</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>{(u.completedToday as string)?.slice(0, 80)}...</TableCell>
                <TableCell sx={{ maxWidth: 200 }}>{(u.inProgress as string)?.slice(0, 80)}...</TableCell>
                <TableCell sx={{ maxWidth: 150 }}>{(u.blockers as string) || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
      <Card>
        <Typography variant="h6" sx={{ p: 2 }}>Blockers (last 7 days)</Typography>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Project</TableCell>
              <TableCell>Blocker</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {blockers.map((b: Record<string, unknown>, i: number) => (
              <TableRow key={i}>
                <TableCell>{dayjs(b.date as string).format('DD MMM YYYY')}</TableCell>
                <TableCell>{(b.userId as { name?: string })?.name}</TableCell>
                <TableCell>{(b.projectId as { name?: string })?.name}</TableCell>
                <TableCell>{(b.blockers as string) || '—'}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </Box>
  );
}
