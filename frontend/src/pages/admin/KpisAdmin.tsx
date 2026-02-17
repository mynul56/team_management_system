import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
} from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { api } from '../../api/client';

const MEASUREMENT_TYPES = ['auto', 'manual'];

export default function KpisAdmin() {
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    weight: 50,
    measurementType: 'manual' as string,
    description: '',
  });

  const load = () => {
    api.get('/kpi').then(({ data }) => setList(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    load();
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({ name: '', weight: 50, measurementType: 'manual', description: '' });
    setOpen(true);
  };

  const handleOpenEdit = (k: Record<string, unknown>) => {
    setEditingId(k._id as string);
    setForm({
      name: (k.name as string) || '',
      weight: (k.weight as number) || 50,
      measurementType: (k.measurementType as string) || 'manual',
      description: (k.description as string) || '',
    });
    setOpen(true);
  };

  const handleSave = async () => {
    if (editingId) {
      await api.put(`/kpi/${editingId}`, form);
    } else {
      await api.post('/kpi', form);
    }
    setOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this KPI?')) return;
    await api.delete(`/kpi/${id}`);
    load();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          KPIs
        </Typography>
        <Button variant="contained" startIcon={<AddIcon />} onClick={handleOpenCreate}>
          Add KPI
        </Button>
      </Box>
      <Card>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Weight %</TableCell>
              <TableCell>Measurement</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((k: Record<string, unknown>) => (
              <TableRow key={(k as { _id: string })._id}>
                <TableCell>{(k as { name: string }).name}</TableCell>
                <TableCell>{(k as { weight: number }).weight}</TableCell>
                <TableCell>{(k as { measurementType: string }).measurementType}</TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenEdit(k)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDelete((k as { _id: string })._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit KPI' : 'New KPI'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} margin="normal" required />
          <TextField fullWidth type="number" inputProps={{ min: 0, max: 100 }} label="Weight %" value={form.weight} onChange={(e) => setForm((f) => ({ ...f, weight: Number(e.target.value) }))} margin="normal" />
          <TextField fullWidth select label="Measurement" value={form.measurementType} onChange={(e) => setForm((f) => ({ ...f, measurementType: e.target.value }))} margin="normal">
            {MEASUREMENT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField fullWidth multiline label="Description" value={form.description} onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))} margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
