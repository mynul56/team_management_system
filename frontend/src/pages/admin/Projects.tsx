import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
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
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import { api } from '../../api/client';
import dayjs from 'dayjs';

const PROJECT_TYPES = ['web', 'app', 'both'];
const PROJECT_STATUSES = ['planning', 'active', 'on_hold', 'completed'];
const ROLES = ['ui_ux', 'frontend', 'backend', 'ai'];

export default function Projects() {
  const [list, setList] = useState<Record<string, unknown>[]>([]);
  const [users, setUsers] = useState<Record<string, unknown>[]>([]);
  const [open, setOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: '',
    client: '',
    projectType: 'web',
    status: 'planning',
    priority: 0,
    deadline: '',
    documentUrls: '' as string,
    figmaLinks: '' as string,
  });
  const [assignments, setAssignments] = useState<Array<{ userId: string; role: string }>>([]);

  const load = () => {
    api.get('/projects').then(({ data }) => setList(Array.isArray(data) ? data : []));
  };

  useEffect(() => {
    load();
    api.get('/users').then(({ data }) => setUsers(Array.isArray(data) ? data : []));
  }, []);

  const handleOpenCreate = () => {
    setEditingId(null);
    setForm({
      name: '',
      client: '',
      projectType: 'web',
      status: 'planning',
      priority: 0,
      deadline: '',
      documentUrls: '',
      figmaLinks: '',
    });
    setOpen(true);
  };

  const handleOpenEdit = (p: Record<string, unknown>) => {
    setEditingId(p._id as string);
    setForm({
      name: (p.name as string) || '',
      client: (p.client as string) || '',
      projectType: (p.projectType as string) || 'web',
      status: (p.status as string) || 'planning',
      priority: (p.priority as number) || 0,
      deadline: p.deadline ? dayjs(p.deadline as string).format('YYYY-MM-DD') : '',
      documentUrls: Array.isArray(p.documentUrls) ? (p.documentUrls as string[]).join('\n') : '',
      figmaLinks: Array.isArray(p.figmaLinks) ? (p.figmaLinks as string[]).join('\n') : '',
    });
    setOpen(true);
  };

  const handleSave = async () => {
    const payload = {
      ...form,
      documentUrls: form.documentUrls ? form.documentUrls.split('\n').filter(Boolean) : [],
      figmaLinks: form.figmaLinks ? form.figmaLinks.split('\n').filter(Boolean) : [],
    };
    if (editingId) {
      await api.put(`/projects/${editingId}`, payload);
    } else {
      await api.post('/projects', payload);
    }
    setOpen(false);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this project?')) return;
    await api.delete(`/projects/${id}`);
    load();
  };

  const handleOpenAssign = (id: string) => {
    const proj = list.find((p) => (p as { _id: string })._id === id) as { assignments?: Array<{ userId?: { _id: string }; role: string }> };
    setAssignments(
      (proj?.assignments || []).map((a) => ({
        userId: (a.userId as { _id?: string })?._id || '',
        role: a.role || 'frontend',
      }))
    );
    setAssignOpen(id);
  };

  const handleSaveAssign = async () => {
    if (!assignOpen) return;
    await api.put(`/projects/${assignOpen}/assignments`, {
      assignments: assignments.filter((a) => a.userId),
    });
    setAssignOpen(null);
    load();
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h5" fontWeight={600}>
          Projects
        </Typography>
        <Button variant="contained" onClick={handleOpenCreate}>
          Add project
        </Button>
      </Box>
      <Card>
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Client</TableCell>
              <TableCell>Type</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Deadline</TableCell>
              <TableCell>Team</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {list.map((p: Record<string, unknown>) => (
              <TableRow key={(p as { _id: string })._id}>
                <TableCell>{(p as { name: string }).name}</TableCell>
                <TableCell>{(p as { client?: string }).client || '—'}</TableCell>
                <TableCell>{(p as { projectType: string }).projectType}</TableCell>
                <TableCell><Chip size="small" label={(p as { status: string }).status} /></TableCell>
                <TableCell>{(p as { deadline?: string }).deadline ? dayjs((p as { deadline: string }).deadline).format('DD MMM YY') : '—'}</TableCell>
                <TableCell>
                  {(p as { assignments?: unknown[] }).assignments?.length || 0} members
                  <IconButton size="small" onClick={() => handleOpenAssign((p as { _id: string })._id)}>
                    <PersonAddIcon fontSize="small" />
                  </IconButton>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small" onClick={() => handleOpenEdit(p)}><EditIcon /></IconButton>
                  <IconButton size="small" onClick={() => handleDelete((p as { _id: string })._id)}><DeleteIcon /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>

      <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit project' : 'New project'}</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} margin="normal" required />
          <TextField fullWidth label="Client" value={form.client} onChange={(e) => setForm((f) => ({ ...f, client: e.target.value }))} margin="normal" />
          <TextField fullWidth select label="Type" value={form.projectType} onChange={(e) => setForm((f) => ({ ...f, projectType: e.target.value }))} margin="normal">
            {PROJECT_TYPES.map((t) => <MenuItem key={t} value={t}>{t}</MenuItem>)}
          </TextField>
          <TextField fullWidth select label="Status" value={form.status} onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))} margin="normal">
            {PROJECT_STATUSES.map((s) => <MenuItem key={s} value={s}>{s}</MenuItem>)}
          </TextField>
          <TextField fullWidth type="number" label="Priority" value={form.priority} onChange={(e) => setForm((f) => ({ ...f, priority: Number(e.target.value) }))} margin="normal" />
          <TextField fullWidth type="date" label="Deadline" value={form.deadline} onChange={(e) => setForm((f) => ({ ...f, deadline: e.target.value }))} margin="normal" InputLabelProps={{ shrink: true }} />
          <TextField fullWidth multiline label="Document URLs (one per line)" value={form.documentUrls} onChange={(e) => setForm((f) => ({ ...f, documentUrls: e.target.value }))} margin="normal" />
          <TextField fullWidth multiline label="Figma links (one per line)" value={form.figmaLinks} onChange={(e) => setForm((f) => ({ ...f, figmaLinks: e.target.value }))} margin="normal" />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <Dialog open={!!assignOpen} onClose={() => setAssignOpen(null)} maxWidth="sm" fullWidth>
        <DialogTitle>Assign team members</DialogTitle>
        <DialogContent>
          {assignments.map((a, i) => (
            <Box key={i} sx={{ display: 'flex', gap: 1, mt: 1 }}>
              <TextField
                select
                fullWidth
                size="small"
                label="User"
                value={a.userId}
                onChange={(e) => setAssignments((prev) => prev.map((x, j) => (j === i ? { ...x, userId: e.target.value } : x)))}
              >
                {users.map((u: Record<string, unknown>) => (
                  <MenuItem key={(u as { _id: string })._id} value={(u as { _id: string })._id}>
                    {(u as { name: string }).name} ({(u as { email: string }).email})
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                size="small"
                label="Role"
                value={a.role}
                onChange={(e) => setAssignments((prev) => prev.map((x, j) => (j === i ? { ...x, role: e.target.value } : x)))}
                sx={{ minWidth: 120 }}
              >
                {ROLES.map((r) => <MenuItem key={r} value={r}>{r}</MenuItem>)}
              </TextField>
            </Box>
          ))}
          <Button sx={{ mt: 2 }} onClick={() => setAssignments((prev) => [...prev, { userId: '', role: 'frontend' }])}>
            Add row
          </Button>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setAssignOpen(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleSaveAssign}>Save</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
