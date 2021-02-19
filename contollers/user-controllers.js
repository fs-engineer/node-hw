import { handleError } from '../lib/handlerror.js';
import Contact from '../service/schema/user-schema.js';

async function listContacts(_req, res) {
  try {
    const contacts = await Contact.find();

    return res.status(200).json({
      status: 'success',
      code: 200,
      data: {
        total: contacts.length,
        contacts,
      },
    });
  } catch (error) {
    handleError(error);
  }
}

async function getContactById(req, res) {
  try {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);

    if (!contact) {
      return res.status(404).json({
        status: 'not found',
        code: 404,
        message: 'Not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      code: 200,
      data: { contact },
    });
  } catch (error) {
    handleError(error);
  }
}

async function addContact(req, res) {
  try {
    const data = req.body;

    const contact = await Contact.create(data);

    return res.status(201).json({
      status: 'success',
      code: 201,
      data: {
        contact,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        status: 'Conflict',
        const: 409,
        message: `This email already exists`,
      });
    }
    handleError(error);
  }
}

async function removeContact(req, res) {
  try {
    const { userId } = req.params;

    const deletedData = await Contact.deleteOne({ _id: userId });

    if (deletedData.n === 0) {
      return res.status(404).json({
        status: 'not found',
        code: 404,
        message: `Id: ${userId} not found.`,
        data: 'Bad request.',
      });
    }

    return res.status(200).json({
      status: 'success',
      code: 200,
      message: `Contact with id: ${userId} deleted`,
      deletedData: deletedData.deletedCount,
    });
  } catch (error) {
    handleError(error);
  }
}

async function updateContact(req, res) {
  try {
    const { userId } = req.params;
    const { body } = req;

    const updatedContact = await Contact.findByIdAndUpdate(userId, body, {
      new: true,
    });

    if (!updatedContact) {
      return res.status(404).send(`ID: ${userId} not found.`);
    }

    return res.json({
      status: 'access',
      code: 200,
      data: {
        updatedContact,
      },
    });
  } catch (error) {
    handleError(error);
  }
}

export default {
  listContacts,
  getContactById,
  addContact,
  removeContact,
  updateContact,
};
