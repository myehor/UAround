import { Router } from 'express';
import { mockEvents } from './data/mockEvents.js';
const router = Router();
router.get('/', (_req, res) => {
    res.json({
        message: 'Events API is working',
        total: mockEvents.length,
        events: mockEvents,
    });
});
export default router;
//# sourceMappingURL=events.js.map