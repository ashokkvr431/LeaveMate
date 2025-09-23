const router = require('express').Router();
const { list, update, remove } = require('../controllers/userController');
const { verifyToken, requireRole } = require('../middleware/auth');

router.get('/', verifyToken, requireRole('admin'), list);
router.put('/:id', verifyToken, requireRole('admin'), update);
router.delete('/:id', verifyToken, requireRole('admin'), remove);

module.exports = router;
