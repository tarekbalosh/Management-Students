const express  = require('express');
const cors     = require('cors');
const helmet   = require('helmet');
const morgan   = require('morgan');
const path     = require('path');
const rateLimit = require('express-rate-limit');
const compression = require('compression');

const { errorHandler, notFoundHandler } = require('./middleware/error.middleware');

const authRoutes         = require('./modules/auth/auth.routes');
const studentRoutes      = require('./modules/students/student.routes');
const universityRoutes   = require('./modules/universities/university.routes');
const applicationRoutes  = require('./modules/applications/application.routes');
const documentRoutes     = require('./modules/documents/document.routes');
const visaRoutes         = require('./modules/visa/visa.routes');
const paymentRoutes      = require('./modules/payments/payment.routes');
const notificationRoutes = require('./modules/notifications/notification.routes');
const dashboardRoutes    = require('./modules/dashboard/dashboard.routes');
const portalRoutes       = require('./modules/portal/portal.routes');

const app = express();

// ── Security Headers ─────────────────────────
app.use(helmet());
app.use(compression());
app.use(cors({
  origin:      process.env.CLIENT_ORIGIN || 'http://localhost:3000',
  credentials: true,
  methods:     ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
}));

// ── Body Parsers ──────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ── Request Logging ───────────────────────────
if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// ── Static Files (Phase 1 local uploads) ──────
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// ── Rate Limiters ─────────────────────────────
const authLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             20,
  message:         { success: false, message: 'Too many auth attempts. Try again in 15 minutes.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

const apiLimiter = rateLimit({
  windowMs:        15 * 60 * 1000,
  max:             300,
  message:         { success: false, message: 'Too many requests.' },
  standardHeaders: true,
  legacyHeaders:   false,
});

// ── Routes ────────────────────────────────────
app.use('/api/auth',          authLimiter, authRoutes);
app.use('/api/students',      apiLimiter,  studentRoutes);
app.use('/api/universities',  apiLimiter,  universityRoutes);
app.use('/api/applications',  apiLimiter,  applicationRoutes);
app.use('/api/documents',     apiLimiter,  documentRoutes);
app.use('/api/visa',          apiLimiter,  visaRoutes);
app.use('/api/payments',      apiLimiter,  paymentRoutes);
app.use('/api/portal',        apiLimiter,  portalRoutes);
app.use('/api/notifications', apiLimiter,  notificationRoutes);
app.use('/api/dashboard',     apiLimiter,  dashboardRoutes);

// ── Health Check ──────────────────────────────
app.get('/api/health', (_req, res) =>
  res.json({ success: true, message: 'API is healthy', timestamp: new Date().toISOString() })
);

// ── Error Handlers ────────────────────────────
app.use(notFoundHandler);
app.use(errorHandler);

module.exports = app;
