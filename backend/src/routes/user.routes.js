import express from 'express';

const router = express.Router();

router.get('/',getAllUsers);
router.get('/:id',getUser);
router.put('/:id',updateUser);
router.delete('/:id',deleteUser);
router.post('/',createUser);


export default router;