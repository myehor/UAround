import { Router } from 'express';
const router = Router();
router.get('/', (_req, res) => {
    res.json({
        message: 'Events API is working',
        events: [],
    });
});
export default router;
//# sourceMappingURL=events.js.map