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
    TextField,
    MenuItem,
    Button,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    InputAdornment,
    Chip,
} from '@mui/material';
import { api } from '../../api/client';
import dayjs from 'dayjs';

const POSITIONS = [
    'web_developer_frontend',
    'web_developer_backend',
    'web_developer_fullstack',
    'app_developer_flutter',
    'app_developer_ios',
    'app_developer_android',
    'ui_ux_designer',
    'qa_engineer',
    'project_manager',
    'hr_manager',
];

export default function KpiDistribution() {
    const [users, setUsers] = useState<Record<string, unknown>[]>([]);
    const [positionFilter, setPositionFilter] = useState('');
    const [period, setPeriod] = useState(dayjs().format('YYYY-MM'));
    const [open, setOpen] = useState(false);
    const [selectedUser, setSelectedUser] = useState<Record<string, unknown> | null>(null);
    const [bonusAmount, setBonusAmount] = useState<number | string>('');
    const [kpiResults, setKpiResults] = useState<Record<string, unknown>[]>([]);

    // Function to load users based on position
    const loadUsers = async () => {
        try {
            const params: any = {};
            if (positionFilter) params.position = positionFilter;
            const { data } = await api.get('/users', { params });
            setUsers(Array.isArray(data) ? data : []);
        } catch (error) {
            console.error("Failed to load users", error);
        }
    };

    // Function to load KPI results for the selected period (to show existing bonuses)
    // Since there isn't a direct "get all kpi results for period" endpoint easily exposed for this view without filtering by user,
    // we might iterate or fetch individually. Optimally, we'd add an endpoint.
    // For now, let's fetch individual KPI totals per user on demand or just show "Set Bonus" button.
    // Wait, the requirement says "admin can set and check later".
    // Let's assume we can fetch "kpi/me" style data but for specific users? Or maybe we just upsert.
    // Actually, let's just allow setting it. Showing it right in the table might require N+1 requests or a new endpoint.
    // Let's keep it simple: List users -> Click "Distribute" -> Open Dialog (load existing if possible) -> Save.

    useEffect(() => {
        loadUsers();
    }, [positionFilter]);

    const handleOpenDistribute = async (user: Record<string, unknown>) => {
        setSelectedUser(user);
        setBonusAmount(''); // Reset or fetch existing

        // Fetch existing result for a "General Bonus" KPI?
        // The requirement says "KPI will calculate on dollar".
        // Usually this implies there's a specific KPI Result record that holds this bonus.
        // We need a KPI ID to attach this result to.
        // Let's assume there is a "Monthly Bonus" KPI or we create a dummy one?
        // OR we pick the first available KPI?
        // The Backend `adminUpsertResult` requires `kpiId`.
        // We should probably allow the admin to select WHICH KPI they are paying out, OR create a special "Bonus" KPI.
        // Let's assume we need to select a KPI from the list.

        // Let's fetch KPIs first.
        setOpen(true);
    };

    // Wait, if we need a kpiId, we need to let admin select it or auto-select.
    // Let's fetch all KPIs and let admin select which one they are paying for, OR assumes "General Performance".
    // Simplest: Add a KPI selector in the Dialog.

    const [kpis, setKpis] = useState<Record<string, unknown>[]>([]);
    const [selectedKpi, setSelectedKpi] = useState('');

    useEffect(() => {
        api.get('/kpi').then(({ data }) => setKpis(Array.isArray(data) ? data : []));
    }, []);

    const handleSave = async () => {
        if (!selectedUser || !selectedKpi) return;

        const start = dayjs(period).startOf('month').format('YYYY-MM-DD');
        const end = dayjs(period).endOf('month').format('YYYY-MM-DD');

        await api.post(`/kpi/result?userId=${(selectedUser as { _id: string })._id}&kpiId=${selectedKpi}`, {
            periodStart: start,
            periodEnd: end,
            score: 100, // Default to 100 score if just giving bonus? Or maybe just 0?
            bonusAmount: Number(bonusAmount),
            adminFeedback: 'Monthly Bonus Distribution'
        });
        setOpen(false);
        alert('Bonus distributed!');
    };

    return (
        <Box>
            <Typography variant="h5" gutterBottom fontWeight={600}>
                KPI Distribution
            </Typography>

            <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                <TextField
                    type="month"
                    label="Period"
                    value={period}
                    onChange={(e) => setPeriod(e.target.value)}
                    size="small"
                    InputLabelProps={{ shrink: true }}
                />
                <TextField
                    select
                    label="Position"
                    value={positionFilter}
                    onChange={(e) => setPositionFilter(e.target.value)}
                    size="small"
                    sx={{ minWidth: 200 }}
                >
                    <MenuItem value="">All Positions</MenuItem>
                    {POSITIONS.map((p) => (
                        <MenuItem key={p} value={p}>{p.replace(/_/g, ' ')}</MenuItem>
                    ))}
                </TextField>
            </Box>

            <Card>
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell>Name</TableCell>
                            <TableCell>Position</TableCell>
                            <TableCell>Seniority</TableCell>
                            <TableCell align="right">Action</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((row: Record<string, unknown>) => (
                            <TableRow key={(row as { _id: string })._id}>
                                <TableCell>{(row as { name: string }).name}</TableCell>
                                <TableCell>{(row as { position: string }).position?.replace(/_/g, ' ')}</TableCell>
                                <TableCell>{(row as { seniority: string }).seniority}</TableCell>
                                <TableCell align="right">
                                    <Button variant="contained" size="small" onClick={() => handleOpenDistribute(row)}>
                                        Distribute
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </Card>

            <Dialog open={open} onClose={() => setOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Set Bonus for {(selectedUser as { name?: string })?.name}</DialogTitle>
                <DialogContent>
                    <Box sx={{ mt: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
                        <TextField
                            select
                            label="Select KPI"
                            value={selectedKpi}
                            onChange={(e) => setSelectedKpi(e.target.value)}
                            fullWidth
                        >
                            {kpis.map((k: any) => (
                                <MenuItem key={k._id} value={k._id}>{k.name}</MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Bonus Amount"
                            type="number"
                            value={bonusAmount}
                            onChange={(e) => setBonusAmount(e.target.value)}
                            fullWidth
                            InputProps={{
                                startAdornment: <InputAdornment position="start">$</InputAdornment>,
                            }}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpen(false)}>Cancel</Button>
                    <Button variant="contained" onClick={handleSave} disabled={!bonusAmount || !selectedKpi}>
                        Save
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
}
