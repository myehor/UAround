import express from 'express';
import eventsRouter from './events.js';
const app = express();
const PORT = 3000;
app.use(express.json());
app.get('/api/health', (_req, res) => {
    res.json({
        status: 'ok',
        message: 'UAround API is running',
    });
});
app.use('/api/events', eventsRouter);
app.listen(PORT, () => {
    console.log(`UAround API is running at http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map