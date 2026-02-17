import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
} from '@mui/material';
import { api } from '../../api/client';
import dayjs from 'dayjs';

const STATUSES = ['present', 'late', 'half_day', 'leave', 'absent'];

export default function AttendanceAdmin() {
  const [from, setFrom] = useState(dayjs().subtract(7, 'day').format('YYYY-MM-DD'));
  const [to, setTo] = useState(dayjs().format('YYYY-MM-DD'));
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [overrideOpen, setOverrideOpen] = useState<Record<string, unknown> | null>(null);
  const [overrideStatus, setOverrideStatus] = useState('present');
  const [overrideReason, setOverrideReason] = useState('');

  const load = () => {
    api.get('/attendance/admin', { params: { from, to } }).then(({ data }) => setList(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    load();
  }, [from, to]);

  const handleOverride = async () => {
    if (!overrideOpen) return;
    await api.put(`/attendance/admin/${(overrideOpen as { _id: string })._id}/override`, {
      status: overrideStatus,
      reason: overrideReason,
    });
    setOverrideOpen(null);
    setOverrideReason('');
    load();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Attendance
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField type="date" size="small" label="From" value={from} onChange={(e) => setFrom(e.target.value)} InputLabelProps={{ shrink: true }} />
        <TextField type="date" size="small" label="To" value={to} onChange={(e) => setTo(e.target.value)} InputLabelProps={{ shrink: true }} />
        <Button variant="contained" onClick={load}>Apply</Button>
      </Box>
      <Card>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Date</TableCell>
              <TableCell>User</TableCell>
              <TableCell>Check-in</TableCell>
              <TableCell>Check-out</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((row: Record<string, unknown>) => (
              <TableRow key={(row as { _id: string })._id}>
                <TableCell>{dayjs(row.date as string).format('DD MMM YYYY')}</TableCell>
                <TableCell>{(row.userId as { name?: string })?.name}</TableCell>
                <TableCell>{row.checkIn ? dayjs(row.checkIn as string).format('HH:mm') : '—'}</TableCell>
                <TableCell>{row.checkOut ? dayjs(row.checkOut as string).format('HH:mm') : '—'}</TableCell>
                <TableCell>
                  <Chip
                    size="small"
                    label={String(row.status).replace(/_/g, ' ')}
                    color={row.adminOverride ? 'secondary' : 'default'}
                  />
                </TableCell>
                <TableCell align="right">
                  <Button size="small" onClick={() => { setOverrideOpen(row); setOverrideStatus((row.status as string) || 'present'); }}>Override</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!overrideOpen} onClose={() => setOverrideOpen(null)}>
        <DialogTitle>Override attendance</DialogTitle>
        <DialogContent>
          <TextField fullWidth select label="Status" value={overrideStatus} onChange={(e) => setOverrideStatus(e.target.value)} margin="normal">
            {STATUSES.map((s) => <MenuItem key={s} value={s}>{s.replace(/_/g, ' ')}</MenuItem>)}
          </TextField>
          <TextField fullWidth multiline label="Reason" value={overrideReason} onChange={(e) => setOverrideReason(e.target.value)} margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOverrideOpen(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleOverride}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
