import express from 'express';
import contacts from '../modules/contacts.js';

const router = express.Router();

router.get('/', (_, res, next) =>
  contacts.listContacts().then(data => res.json(data)),
);

router.get('/:id', (req, res, next) => {
  const { id } = req.params;

  contacts.getContactById(id).then(data => res.json(data));
});

router.delete('/:id', (req, res, next) => {
  const { id } = req.params;
  contacts.removeContact(id).then(data => res.json(data));
});

router.post('/', (req, res) => {
  const { name, email, phone } = req.body;

  contacts.addContact(name, email, phone).then(data => res.json(data));
});

export default router;
