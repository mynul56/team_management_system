import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  Chip,
  Skeleton,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
} from '@mui/material';
import { api } from '../api/client';
import dayjs from 'dayjs';

export default function Attendance() {
  const [today, setToday] = useState<Record<string, unknown> | null>(null);
  const [history, setHistory] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [acting, setActing] = useState<'in' | 'out' | null>(null);

  const load = () => {
    setLoading(true);
    Promise.all([
      api.get('/attendance/me/today').then((r) => r.data),
      api.get('/attendance/me', {
        params: {
          from: dayjs().subtract(14, 'day').format('YYYY-MM-DD'),
          to: dayjs().format('YYYY-MM-DD'),
        },
      }).then((r) => r.data),
    ])
      .then(([t, h]) => {
        setToday(t || null);
        setHistory(Array.isArray(h) ? h : []);
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleCheckIn = async () => {
    setActing('in');
    try {
      await api.post('/attendance/check-in', {});
      load();
    } finally {
      setActing(null);
    }
  };

  const handleCheckOut = async () => {
    setActing('out');
    try {
      await api.post('/attendance/check-out', {});
      load();
    } finally {
      setActing(null);
    }
  };

  if (loading && today === undefined) return <Skeleton variant="rectangular" height={200} />;

  const hasCheckedIn = today?.checkIn;
  const hasCheckedOut = today?.checkOut;

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Attendance
      </Typography>
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="subtitle1" color="text.secondary" gutterBottom>
            Today — {dayjs().format('DD MMM YYYY')}
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', alignItems: 'center' }}>
            {today?.status != null && (
              <Chip label={String(today.status).replace(/_/g, ' ')} color="primary" variant="outlined" />
            )}
            {!!today?.checkIn && (
              <Typography variant="body2">
                Check-in: {dayjs(today.checkIn as string).format('HH:mm')}
              </Typography>
            )}
            {!!today?.checkOut && (
              <Typography variant="body2">
                Check-out: {dayjs(today.checkOut as string).format('HH:mm')}
              </Typography>
            )}
            {!hasCheckedIn && (
              <Button variant="contained" onClick={handleCheckIn} disabled={!!acting}>
                Present (Check-in)
              </Button>
            )}
            {!!hasCheckedIn && !hasCheckedOut && (
              <Button variant="outlined" color="secondary" onClick={handleCheckOut} disabled={!!acting}>
                Leave office (Check-out)
              </Button>
            )}
          </Box>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Recent history</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Date</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Check-in</TableCell>
                <TableCell>Check-out</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {history.map((row: Record<string, unknown>, i: number) => (
                <TableRow key={i}>
                  <TableCell>{dayjs(row.date as string).format('DD MMM YYYY')}</TableCell>
                  <TableCell>{String(row.status).replace(/_/g, ' ')}</TableCell>
                  <TableCell>{row.checkIn ? dayjs(row.checkIn as string).format('HH:mm') : '—'}</TableCell>
                  <TableCell>{row.checkOut ? dayjs(row.checkOut as string).format('HH:mm') : '—'}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
