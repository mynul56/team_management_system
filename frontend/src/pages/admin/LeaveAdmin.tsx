import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Chip,
  MenuItem,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material';
import { api } from '../../api/client';
import dayjs from 'dayjs';

export default function LeaveAdmin() {
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [filter, setFilter] = useState('pending');
  const [reviewOpen, setReviewOpen] = useState<Record<string, unknown> | null>(null);
  const [reviewNote, setReviewNote] = useState('');

  const load = () => {
    api.get('/leave/admin', { params: { status: filter || undefined } }).then(({ data }) => setList(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    load();
  }, [filter]);

  const handleReview = async (status: 'approved' | 'rejected') => {
    if (!reviewOpen) return;
    await api.put(`/leave/admin/${(reviewOpen as { _id: string })._id}/review`, { status, reviewNote });
    setReviewOpen(null);
    setReviewNote('');
    load();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Leave requests
      </Typography>
      <Box sx={{ mb: 2 }}>
        <TextField select size="small" label="Status" value={filter} onChange={(e) => setFilter(e.target.value)} sx={{ minWidth: 120 }}>
          <MenuItem value="">All</MenuItem>
          <MenuItem value="pending">Pending</MenuItem>
          <MenuItem value="approved">Approved</MenuItem>
          <MenuItem value="rejected">Rejected</MenuItem>
        </TextField>
      </Box>
      <Card>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>User</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Start</TableCell>
              <TableCell>End</TableCell>
              <TableCell>Reason</TableCell>
              <TableCell>Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((row: Record<string, unknown>) => (
              <TableRow key={(row as { _id: string })._id}>
                <TableCell>{(row.userId as { name?: string })?.name || '—'}</TableCell>
                <TableCell>{String(row.leaveType).replace(/_/g, ' ')}</TableCell>
                <TableCell>{dayjs(row.startDate as string).format('DD MMM YYYY')}</TableCell>
                <TableCell>{dayjs(row.endDate as string).format('DD MMM YYYY')}</TableCell>
                <TableCell>{(row.reason as string) || '—'}</TableCell>
                <TableCell><Chip size="small" label={String(row.status)} color={row.status === 'approved' ? 'success' : row.status === 'rejected' ? 'error' : 'default'} /></TableCell>
                <TableCell align="right">
                  {row.status === 'pending' && (
                    <Button size="small" onClick={() => setReviewOpen(row)}>Review</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={!!reviewOpen} onClose={() => setReviewOpen(null)}>
        <DialogTitle>Review leave</DialogTitle>
        <DialogContent>
          <TextField fullWidth multiline label="Note" value={reviewNote} onChange={(e) => setReviewNote(e.target.value)} margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setReviewOpen(null)}>Cancel</Button>
          <Button color="error" onClick={() => handleReview('rejected')}>Reject</Button>
          <Button variant="contained" color="success" onClick={() => handleReview('approved')}>Approve</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
