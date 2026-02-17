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
  Skeleton,
} from '@mui/material';
import { api } from '../api/client';
import dayjs from 'dayjs';

export default function DailyUpdate() {
  const [projects, setProjects] = useState<Array<{ _id: string; name: string }>>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [form, setForm] = useState({ projectId: '', completedToday: '', inProgress: '', blockers: '' });

  useEffect(() => {
    api.get('/projects').then(({ data }) => {
      const proj = Array.isArray(data) ? data : [];
      setProjects(proj);
      if (proj.length === 0) {
        setMessage({ type: 'error', text: 'No projects found. Please ask an admin to assign you a project.' });
      }
    }).catch(() => {
      setMessage({ type: 'error', text: 'Failed to load projects.' });
    }).finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage(null);
    try {
      await api.post('/daily-updates', form, {
        params: { date: dayjs().format('YYYY-MM-DD') },
      });
      setMessage({ type: 'success', text: 'Daily update submitted.' });
      setForm((f) => ({ ...f, completedToday: '', inProgress: '', blockers: '' }));
    } catch {
      setMessage({ type: 'error', text: 'Failed to submit.' });
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton variant="rectangular" height={300} />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Daily update
      </Typography>
      <Typography color="text.secondary" variant="body2" sx={{ mb: 2 }}>
        {dayjs().format('dddd, DD MMM YYYY')}
      </Typography>
      {message && (
        <Alert severity={message.type} sx={{ mb: 2 }} onClose={() => setMessage(null)}>
          {message.text}
        </Alert>
      )}
      <Card>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              select
              label="Project"
              value={form.projectId}
              onChange={(e) => setForm((f) => ({ ...f, projectId: e.target.value }))}
              margin="normal"
              required
            >
              {projects.map((p) => (
                <MenuItem key={p._id} value={p._id}>{p.name}</MenuItem>
              ))}
            </TextField>
            <TextField
              fullWidth
              multiline
              rows={3}
              label="What was completed today"
              value={form.completedToday}
              onChange={(e) => setForm((f) => ({ ...f, completedToday: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              multiline
              rows={3}
              label="What is in progress"
              value={form.inProgress}
              onChange={(e) => setForm((f) => ({ ...f, inProgress: e.target.value }))}
              margin="normal"
              required
            />
            <TextField
              fullWidth
              multiline
              rows={2}
              label="Blockers (optional)"
              value={form.blockers}
              onChange={(e) => setForm((f) => ({ ...f, blockers: e.target.value }))}
              margin="normal"
            />
            <Button type="submit" variant="contained" disabled={saving} sx={{ mt: 2 }}>
              Submit
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
