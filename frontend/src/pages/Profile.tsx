import { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  TextField,
  Button,
  Chip,
  Skeleton,
  MenuItem,
  Alert,
} from '@mui/material';
import { useAuth } from '../contexts/AuthContext';
import { api } from '../api/client';

const POSITIONS = [
  'ui_ux_designer',
  'web_developer_frontend',
  'web_developer_backend',
  'web_developer_fullstack',
  'flutter_developer',
  'ai_ml_developer',
];
const SENIORITIES = ['trainee', 'junior', 'mid', 'senior', 'lead'];

const label = (v: string) => v.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

export default function Profile() {
  const { user, refreshUser } = useAuth();
  const [profile, setProfile] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', position: '', seniority: '' });

  useEffect(() => {
    api.get('/users/me').then(({ data }) => {
      setProfile(data);
      setForm({
        name: data.name || '',
        position: data.position || '',
        seniority: data.seniority || '',
      });
    }).finally(() => setLoading(false));
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      await api.put('/users/me', form);
      setMessage('Profile updated.');
      refreshUser();
    } catch {
      setMessage('Failed to update.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <Skeleton variant="rectangular" height={300} />;

  const assignments = (profile?.assignedProjects as Array<{ projectId?: { name?: string }; role?: string }>) || [];

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        Profile
      </Typography>
      {message && <Alert severity={message === 'Profile updated.' ? 'success' : 'error'} sx={{ mb: 2 }}>{message}</Alert>}
      <Card sx={{ mb: 2 }}>
        <CardContent>
          <Typography color="text.secondary" variant="body2">Email (read-only)</Typography>
          <Typography variant="body1" sx={{ mb: 2 }}>{profile?.email as string}</Typography>
          <TextField fullWidth label="Name" value={form.name} onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))} margin="normal" />
          <TextField fullWidth select label="Position" value={form.position} onChange={(e) => setForm((f) => ({ ...f, position: e.target.value }))} margin="normal">
            {POSITIONS.map((p) => <MenuItem key={p} value={p}>{label(p)}</MenuItem>)}
          </TextField>
          <TextField fullWidth select label="Seniority" value={form.seniority} onChange={(e) => setForm((f) => ({ ...f, seniority: e.target.value }))} margin="normal">
            {SENIORITIES.map((s) => <MenuItem key={s} value={s}>{label(s)}</MenuItem>)}
          </TextField>
          <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ mt: 2 }}>
            Save
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>Assigned projects</Typography>
          {assignments.length === 0 ? (
            <Typography color="text.secondary">None</Typography>
          ) : (
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
              {assignments.map((a: { projectId?: { name?: string }; role?: string }, i: number) => (
                <Chip key={i} label={`${a.projectId?.name || 'Project'} (${a.role})`} size="small" />
              ))}
            </Box>
          )}
        </CardContent>
      </Card>
    </Box>
  );
}
