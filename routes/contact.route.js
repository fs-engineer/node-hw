import express from 'express';
import contacts from '../modules/contacts.js';

const router = express.Router();

router.get('/', (req, res, next) =>
  contacts.listContacts().then(data => res.json(data)),
);

router.get('/:id', (req, res, next) => {
  const { id } = req.params;
  console.log(id);

  contacts.getContactById(Number(id)).then(data => {
    console.log(data);
    return res.json(data);
  });
});

export default router;
