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
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../../api/client';

const POSITIONS = ['ui_ux_designer', 'web_developer_frontend', 'web_developer_backend', 'web_developer_fullstack', 'flutter_developer', 'ai_ml_developer'];
const SENIORITIES = ['trainee', 'junior', 'mid', 'senior', 'lead'];

const label = (v: string) => v.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function Users() {
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [pending, setPending] = useState<Record<string, unknown>[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const load = () => {
    Promise.all([
      api.get('/users').then(({ data }) => setList(Array.isArray(data) ? data : [])),
      api.get('/users', { params: { pending: 'true' } }).then(({ data }) => setPending(Array.isArray(data) ? data : [])),
    ]).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const approve = async (id: string) => {
    await api.put(`/users/${id}/approve`);
    load();
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    await api.delete(`/users/${deleteId}`);
    setDeleteId(null);
    load();
  };

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Users
      </Typography>
      {pending.length > 0 && (
        <Card sx={{ mb: 2, bgcolor: 'action.hover' }}>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Seniority</TableCell>
                <TableCell align="right">Action</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {pending.map((u: Record<string, unknown>) => (
                <TableRow key={(u as { _id: string })._id}>
                  <TableCell>{(u as { name: string }).name}</TableCell>
                  <TableCell>{(u as { email: string }).email}</TableCell>
                  <TableCell>{label((u as { position: string }).position)}</TableCell>
                  <TableCell>{label((u as { seniority: string }).seniority)}</TableCell>
                  <TableCell align="right">
                    <Button size="small" variant="contained" onClick={() => approve((u as { _id: string })._id)}>
                      Approve
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Name</TableCell>
            <TableCell>Email</TableCell>
            <TableCell>Position</TableCell>
            <TableCell>Seniority</TableCell>
            <TableCell>Role</TableCell>
            <TableCell>Status</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {list.map((u: Record<string, unknown>) => (
            <TableRow key={(u as { _id: string })._id}>
              <TableCell>{(u as { name: string }).name}</TableCell>
              <TableCell>{(u as { email: string }).email}</TableCell>
              <TableCell>{label((u as { position: string }).position)}</TableCell>
              <TableCell>{label((u as { seniority: string }).seniority)}</TableCell>
              <TableCell><Chip size="small" label={(u as { role: string }).role} /></TableCell>
              <TableCell>
                <Chip size="small" color={(u as { isActive: boolean }).isActive ? 'success' : 'default'} label={(u as { isActive: boolean }).isActive ? 'Active' : 'Inactive'} />
              </TableCell>
              <TableCell align="right">
                <Button size="small" color="error" startIcon={<DeleteIcon />} onClick={() => setDeleteId((u as { _id: string })._id)}>
                  Remove
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Dialog open={!!deleteId} onClose={() => setDeleteId(null)}>
        <DialogTitle>Confirm Removal</DialogTitle>
        <DialogContent>
          Are you sure you want to remove this member? This action cannot be undone.
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button color="error" variant="contained" onClick={handleDelete}>Remove</Button>
        </DialogActions>
      </Dialog>
    </Box >
  );
}
