import { Hono } from 'hono';
import { VerificationController } from '../controllers/verification.controller';
import { validateCreateVerification, validateVerificationId } from '../validators/verification.validator';
import { Env } from '../types';

const router = new Hono<{ Bindings: Env }>();
const controller = new VerificationController();

// POST /verification
router.post('/', validateCreateVerification, controller.create);

// GET /verification/:id
router.get('/:id', validateVerificationId, controller.get);

export { router as verificationRoutes };
