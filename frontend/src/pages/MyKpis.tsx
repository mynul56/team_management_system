import { useEffect, useState } from 'react';
import { Box, Card, CardContent, Typography, LinearProgress, Skeleton, TextField, Button } from '@mui/material';
import { api } from '../api/client';
import dayjs from 'dayjs';

export default function MyKpis() {
  const [data, setData] = useState<Array<{ kpi: Record<string, unknown>; result: Record<string, unknown> | null }>>([]);
  const [loading, setLoading] = useState(true);
  const [periodStart, setPeriodStart] = useState(dayjs().startOf('month').format('YYYY-MM-DD'));
  const [periodEnd, setPeriodEnd] = useState(dayjs().endOf('month').format('YYYY-MM-DD'));

  useEffect(() => {
    setLoading(true);
    api
      .get('/kpi/me', { params: { periodStart, periodEnd } })
      .then(({ data: res }) => setData(Array.isArray(res) ? res : []))
      .finally(() => setLoading(false));
  }, [periodStart, periodEnd]);

  if (loading && data.length === 0) return <Skeleton variant="rectangular" height={200} />;

  return (
    <Box>
      <Typography variant="h5" gutterBottom fontWeight={600}>
        My KPIs
      </Typography>
      <Box sx={{ display: 'flex', gap: 2, mb: 3, flexWrap: 'wrap' }}>
        <TextField
          type="date"
          label="Period start"
          value={periodStart}
          onChange={(e) => setPeriodStart(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
        <TextField
          type="date"
          label="Period end"
          value={periodEnd}
          onChange={(e) => setPeriodEnd(e.target.value)}
          size="small"
          InputLabelProps={{ shrink: true }}
        />
      </Box>
      {data.length === 0 ? (
        <Typography color="text.secondary">No KPIs assigned for this period.</Typography>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {data.map((item, i) => (
            <Card key={i}>
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>
                  {(item.kpi as { name?: string }).name}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Weight: {(item.kpi as { weight?: number }).weight}%
                  {!!item.result?.adminFeedback && ` • ${item.result.adminFeedback as string}`}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <LinearProgress
                    variant="determinate"
                    value={(item.result?.score as number) ?? 0}
                    sx={{ height: 8, borderRadius: 1 }}
                  />
                  <Typography variant="body2" color="text.secondary">
                    Score: {(item.result?.score as number) ?? '—'}%
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );
}
