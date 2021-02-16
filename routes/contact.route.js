import express from 'express';
import contactController from '../contollers/contact-controllers.js';
import contacts from '../modules/contacts.js';

const router = express.Router();

router.get('/', (req, res, next) => contactController.listContacts(req, res));

router.get('/:contactId', (req, res, next) =>
  contactController.getContactById(req, res),
);

router.post('/', contactController.validateUser, (req, res) =>
  contactController.addContact(req, res),
);

router.delete('/:contactId', (req, res, next) => {
  contactController.removeContact(req, res);
  // const { id } = req.params;
  // contacts.removeContact(id).then(data =>
  //   res.status(204).json({
  //     status: 'deleted',
  //     code: 204,
  //     data: {
  //       data,
  //     },
  //   }),
  // );
});

router.patch('/', (req, res) => {
  const reqData = req.body;

  contacts
    .updateContact(reqData)
    .then(data => res.json(data))
    .catch(err =>
      res.status(404).json({
        status: 'fail',
        code: 404,
        message: err.message,
        data: 'Not found',
      }),
    );
});

export default router;
