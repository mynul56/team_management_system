import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  Link as MuiLink,
  MenuItem,
  Stack,
  InputAdornment,
  IconButton,
} from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useAuth } from '../contexts/AuthContext';

const POSITIONS = [
  { value: 'ui_ux_designer', label: 'UI/UX Designer' },
  { value: 'web_developer_frontend', label: 'Web Developer (Frontend)' },
  { value: 'web_developer_backend', label: 'Web Developer (Backend)' },
  { value: 'web_developer_fullstack', label: 'Web Developer (Full-Stack)' },
  { value: 'flutter_developer', label: 'Flutter Developer' },
  { value: 'ai_ml_developer', label: 'AI/ML Developer' },
];

const SENIORITIES = [
  { value: 'trainee', label: 'Trainee' },
  { value: 'junior', label: 'Junior' },
  { value: 'mid', label: 'Mid' },
  { value: 'senior', label: 'Senior' },
  { value: 'lead', label: 'Lead' },
];

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState('');
  const [position, setPosition] = useState('');
  const [seniority, setSeniority] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage(null);
    try {
      await register({ email, password, name, position, seniority });
      setMessage({ type: 'success', text: 'Registration submitted. You can now login.' }); // Auto-approve active
      setTimeout(() => navigate('/login'), 2000);
    } catch (err: unknown) {
      setMessage({
        type: 'error',
        text: (err as { response?: { data?: { message?: string } } })?.response?.data?.message || 'Registration failed',
      });
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        bgcolor: 'background.default',
        p: 2,
      }}
    >
      <Card sx={{ maxWidth: 500, width: '100%', boxShadow: 3, borderRadius: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Box sx={{ mb: 3, textAlign: 'center' }}>
            <Typography variant="h4" gutterBottom fontWeight={700}>
              Get started with TeamSync
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Create your account to join the team.
            </Typography>
          </Box>

          {message && (
            <Alert severity={message.type} sx={{ mb: 3 }}>
              {message.text}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            <Stack spacing={2.5}>
              <TextField
                fullWidth
                label="Full Name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Email address"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />

              <TextField
                fullWidth
                label="Password"
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                inputProps={{ minLength: 8 }}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
                <TextField
                  fullWidth
                  select
                  label="Position"
                  value={position}
                  onChange={(e) => setPosition(e.target.value)}
                  required
                >
                  {POSITIONS.map((p) => (
                    <MenuItem key={p.value} value={p.value}>{p.label}</MenuItem>
                  ))}
                </TextField>

                <TextField
                  fullWidth
                  select
                  label="Seniority"
                  value={seniority}
                  onChange={(e) => setSeniority(e.target.value)}
                  required
                >
                  {SENIORITIES.map((s) => (
                    <MenuItem key={s.value} value={s.value}>{s.label}</MenuItem>
                  ))}
                </TextField>
              </Stack>
            </Stack>

            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3, py: 1.5, fontSize: '1rem' }}>
              Create Account
            </Button>
          </form>

          <Typography sx={{ mt: 3, textAlign: 'center' }} variant="body2">
            Already have an account? <MuiLink component={Link} to="/login" fontWeight={600}>Sign in</MuiLink>
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}
