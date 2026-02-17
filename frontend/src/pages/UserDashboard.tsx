import { useState, useEffect } from 'react';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Checkbox,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Chip,
    IconButton,
    Divider,
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import AssignmentIcon from '@mui/icons-material/Assignment';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { useAuth } from '../contexts/AuthContext';
import dayjs from 'dayjs';

export default function UserDashboard() {
    const { user } = useAuth();
    const [tasks, setTasks] = useState([
        { id: 1, text: 'Complete UI Redesign', completed: false },
        { id: 2, text: 'Fix Daily Updates API', completed: true },
        { id: 3, text: 'Review Pull Requests', completed: false },
    ]);

    const handleToggle = (id: number) => {
        setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    };

    const loginTime = dayjs().subtract(2, 'hour').format('h:mm A'); // Mock login time for now

    return (
        <Box>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" sx={{ mb: 1 }}>
                    Hi, {user?.name?.split(' ')[0]} 👋
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Here's what's happening with your projects today.
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Status Card */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%', bgcolor: 'primary.lighter', color: 'primary.darker' }}>
                        <CardContent>
                            <Typography variant="subtitle2" sx={{ opacity: 0.72 }}>
                                Today's Status
                            </Typography>
                            <Typography variant="h3" sx={{ my: 2 }}>
                                Present
                            </Typography>
                            <Chip
                                icon={<CheckCircleIcon />}
                                label="On Time"
                                color="success"
                                size="small"
                                sx={{ bgcolor: 'rgba(255, 255, 255, 0.48)' }}
                            />
                        </CardContent>
                    </Card>
                </Grid>

                {/* Login Time Card */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'info.lighter', color: 'info.main', mr: 2 }}>
                                    <AccessTimeIcon />
                                </Box>
                                <Typography variant="subtitle2">Login Time</Typography>
                            </Box>
                            <Typography variant="h4">{loginTime}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                Checked in at 9:00 AM
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Tasks Card */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                <Box sx={{ p: 1.5, borderRadius: 1.5, bgcolor: 'warning.lighter', color: 'warning.main', mr: 2 }}>
                                    <AssignmentIcon />
                                </Box>
                                <Typography variant="subtitle2">Pending Tasks</Typography>
                            </Box>
                            <Typography variant="h4">{tasks.filter(t => !t.completed).length}</Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                {tasks.filter(t => t.completed).length} completed today
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Task List */}
                <Grid item xs={12} md={8}>
                    <Card>
                        <Box sx={{ p: 3, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Typography variant="h6">Today's Tasks</Typography>
                            <IconButton size="small"><MoreVertIcon /></IconButton>
                        </Box>
                        <Divider />
                        <List>
                            {tasks.map((task) => (
                                <ListItem
                                    key={task.id}
                                    button
                                    onClick={() => handleToggle(task.id)}
                                    secondaryAction={
                                        <IconButton edge="end" aria-label="comments">
                                            {/* <CommentIcon /> */}
                                        </IconButton>
                                    }
                                >
                                    <ListItemIcon>
                                        <Checkbox
                                            edge="start"
                                            checked={task.completed}
                                            tabIndex={-1}
                                            disableRipple
                                        />
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={task.text}
                                        primaryTypographyProps={{
                                            sx: {
                                                textDecoration: task.completed ? 'line-through' : 'none',
                                                color: task.completed ? 'text.secondary' : 'text.primary'
                                            }
                                        }}
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Card>
                </Grid>

                {/* Daily Update Summary */}
                <Grid item xs={12} md={4}>
                    <Card sx={{ height: '100%' }}>
                        <Box sx={{ p: 3 }}>
                            <Typography variant="h6" gutterBottom>Daily Update</Typography>
                            <Box sx={{
                                p: 2,
                                borderRadius: 2,
                                bgcolor: 'background.default',
                                border: '1px dashed',
                                borderColor: 'text.secondary',
                                textAlign: 'center'
                            }}>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                    You haven't submitted your daily update yet.
                                </Typography>
                                <Chip
                                    label="Submit Now"
                                    color="primary"
                                    onClick={() => { /* Navigate */ }}
                                    clickable
                                />
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
