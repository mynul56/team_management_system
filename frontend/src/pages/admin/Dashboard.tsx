import { useEffect, useState } from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  TextField,
  Button,
  Skeleton,
  Chip,
  Stack,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import PeopleIcon from '@mui/icons-material/People';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import BeachAccessIcon from '@mui/icons-material/BeachAccess';
import FolderIcon from '@mui/icons-material/Folder';
import { api } from '../../api/client';
import dayjs from 'dayjs';

// Mock data for charts if API doesn't return it yet
const mockChartData = [
  { name: 'Mon', present: 40, absent: 24 },
  { name: 'Tue', present: 30, absent: 13 },
  { name: 'Wed', present: 20, absent: 58 },
  { name: 'Thu', present: 27, absent: 39 },
  { name: 'Fri', present: 18, absent: 48 },
  { name: 'Sat', present: 23, absent: 38 },
  { name: 'Sun', present: 34, absent: 43 },
];

export default function Dashboard() {
  const [from, setFrom] = useState(dayjs().subtract(7, 'day').format('YYYY-MM-DD'));
  const [to, setTo] = useState(dayjs().format('YYYY-MM-DD'));
  const [data, setData] = useState<Record<string, unknown> | null>(null);
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    // Ideally this API returns aggregated data for the cards and charts
    api.get('/analytics/dashboard', { params: { from, to } }).then(({ data: d }) => {
      setData(d);
    }).finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  if (loading && !data) return (
    <Box sx={{ p: 1 }}>
      <Skeleton variant="rectangular" height={120} sx={{ mb: 2, borderRadius: 2 }} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={8}><Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} /></Grid>
        <Grid item xs={12} md={4}><Skeleton variant="rectangular" height={300} sx={{ borderRadius: 2 }} /></Grid>
      </Grid>
    </Box>
  );

  const byStatus = (data?.attendanceOverview as { byStatus?: Record<string, number> })?.byStatus || {};
  const projectHealth = (data?.projectHealth as Array<{ name: string; status: string; memberCount: number }>) || [];

  // Stats for cards
  const totalEmployees = 12; // Mock total
  const presentToday = byStatus['present'] || 0;
  const onLeave = byStatus['leave'] || 0;
  const activeProjects = projectHealth.filter(p => p.status === 'active').length;

  return (
    <Box>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" fontWeight={700}>Admin Dashboard</Typography>
          <Typography variant="body2" color="text.secondary">Overview of your team's performance.</Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <TextField
            type="date"
            size="small"
            value={from}
            onChange={(e) => setFrom(e.target.value)}
            sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
          />
          <TextField
            type="date"
            size="small"
            value={to}
            onChange={(e) => setTo(e.target.value)}
            sx={{ bgcolor: 'background.paper', borderRadius: 1 }}
          />
          <Button variant="contained" onClick={load}>Filter</Button>
        </Box>
      </Box>

      {/* Top Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#E3F2FD', color: '#1565C0', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'rgba(21, 101, 192, 0.16)', mr: 2 }}>
                  <PeopleIcon />
                </Box>
                <Typography variant="subtitle2" fontWeight={600}>Total Employees</Typography>
              </Box>
              <Typography variant="h3" fontWeight={700}>{totalEmployees}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'rgba(46, 125, 50, 0.16)', mr: 2 }}>
                  <CheckCircleIcon />
                </Box>
                <Typography variant="subtitle2" fontWeight={600}>Present Today</Typography>
              </Box>
              <Typography variant="h3" fontWeight={700}>{presentToday}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#FFF8E1', color: '#FF8F00', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'rgba(255, 143, 0, 0.16)', mr: 2 }}>
                  <BeachAccessIcon />
                </Box>
                <Typography variant="subtitle2" fontWeight={600}>On Leave</Typography>
              </Box>
              <Typography variant="h3" fontWeight={700}>{onLeave}</Typography>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ bgcolor: '#F3E5F5', color: '#7B1FA2', height: '100%' }}>
            <CardContent>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Box sx={{ p: 1, borderRadius: '50%', bgcolor: 'rgba(123, 31, 162, 0.16)', mr: 2 }}>
                  <FolderIcon />
                </Box>
                <Typography variant="subtitle2" fontWeight={600}>Active Projects</Typography>
              </Box>
              <Typography variant="h3" fontWeight={700}>{activeProjects}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Grid container spacing={3}>
        {/* Analytics Chart */}
        <Grid item xs={12} md={8}>
          <Card sx={{ height: '100%' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>Attendance Trend</Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
                Weekly attendance overview
              </Typography>
              <Box sx={{ height: 320, width: '100%' }}>
                <ResponsiveContainer>
                  <BarChart data={mockChartData}>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} />
                    <XAxis dataKey="name" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip
                      cursor={{ fill: 'transparent' }}
                      contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                    />
                    <Bar dataKey="present" fill="#2E7D32" radius={[4, 4, 0, 0]} barSize={20} />
                    <Bar dataKey="absent" fill="#FF8F00" radius={[4, 4, 0, 0]} barSize={20} />
                  </BarChart>
                </ResponsiveContainer>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Project Health / Live Status */}
        <Grid item xs={12} md={4}>
          <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardContent sx={{ flexGrow: 1 }}>
              <Typography variant="h6" gutterBottom>Project Health</Typography>
              <Stack spacing={2} sx={{ mt: 2 }}>
                {projectHealth.map((p, i) => (
                  <Box key={i} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 1.5, borderRadius: 1.5, border: '1px solid', borderColor: 'divider' }}>
                    <Box>
                      <Typography variant="subtitle2">{p.name}</Typography>
                      <Typography variant="caption" color="text.secondary">{p.memberCount} members</Typography>
                    </Box>
                    <Chip
                      label={p.status}
                      size="small"
                      color={p.status === 'active' ? 'success' : 'default'}
                      variant="outlined"
                    />
                  </Box>
                ))}
                {projectHealth.length === 0 && (
                  <Typography variant="body2" color="text.secondary" align="center">No active projects</Typography>
                )}
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
