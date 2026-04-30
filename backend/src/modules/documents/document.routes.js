const router = require('express').Router();
const ctrl = require('./document.controller');
const authenticate = require('../../middleware/authenticate');
const authorize = require('../../middleware/authorize');
const upload = require('../../config/multerConfig');

router.use(authenticate);

// POST /api/documents/upload - students and staff
router.post('/upload', upload.array('files', 5), ctrl.upload);

// GET /api/documents/all - administrative overview
router.get('/all', authorize('admin', 'employee'), ctrl.listAll);

// GET /api/documents/:studentId - admins/employees, or the student themselves
router.get('/:studentId', ctrl.listByStudent);

// GET /api/documents/file/:documentId - stream file
router.get('/file/:documentId', ctrl.serveFile);

// DELETE /api/documents/:documentId - staff only
router.delete('/:documentId', authorize('admin', 'employee'), ctrl.remove);

// PATCH /api/documents/:documentId/status - staff only
router.patch('/:documentId/status', authorize('admin', 'employee'), ctrl.updateDocumentStatus);

module.exports = router;
