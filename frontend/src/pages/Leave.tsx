import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  MenuItem,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  Skeleton,
} from '@mui/material';
import { api } from '../api/client';
import dayjs from 'dayjs';

const LEAVE_TYPES = [
  { value: 'casual', label: 'Casual' },
  { value: 'sick', label: 'Sick' },
  { value: 'emergency', label: 'Emergency' },
  { value: 'wfh', label: 'WFH' },
];

export default function Leave() {
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({
    leaveType: 'casual',
    startDate: dayjs().format('YYYY-MM-DD'),
    endDate: dayjs().format('YYYY-MM-DD'),
    reason: '',
  });

  const load = () => {
    api.get('/leave/me').then(({ data }) => setList(Array.isArray(data) ? data : [])).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await api.post('/leave', form);
      setMessage({ type: 'success', text: 'Leave request submitted.' });
      setForm((f) => ({ ...f, reason: '' }));
      load();
    } catch {
      setMessage({ type: 'error', text: 'Failed to submit.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton variant="rectangular" height={200} />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Leave
      </Typography>
      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>Request leave</Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              select
              label="Leave type"
              value={form.leaveType}
              onChange={(e) => setForm((f) => ({ ...f, leaveType: e.target.value }))}
              margin="normal"
            >
              {LEAVE_TYPES.map((t) => (
                <MenuItem key={t.value} value={t.value}>{t.label}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              type="date"
              label="Start date"
              value={form.startDate}
              onChange={(e) => setForm((f) => ({ ...f, startDate: e.target.value }))}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              type="date"
              label="End date"
              value={form.endDate}
              onChange={(e) => setForm((f) => ({ ...f, endDate: e.target.value }))}
              margin="normal"
              InputLabelProps={{ shrink: true }}
              required
            />
            <TextField
              fullWidth
              multiline
              label="Reason (optional)"
              value={form.reason}
              onChange={(e) => setForm((f) => ({ ...f, reason: e.target.value }))}
              margin="normal"
            />
            <Button type="submit" variant="contained" disabled={saving} sx={{ mt: 2 }}>
              Submit request
            </Button>
          </form>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>My requests</Typography>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Type</TableCell>
                <TableCell>Start</TableCell>
                <TableCell>End</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {list.map((row: Record<string, unknown>, i: number) => (
                <TableRow key={i}>
                  <TableCell>{String(row.leaveType).replace(/_/g, ' ')}</TableCell>
                  <TableCell>{dayjs(row.startDate as string).format('DD MMM YYYY')}</TableCell>
                  <TableCell>{dayjs(row.endDate as string).format('DD MMM YYYY')}</TableCell>
                  <TableCell>
                    <Chip
                      label={String(row.status)}
                      size="small"
                      color={row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'error' : 'default'}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </Box>
  );
}
