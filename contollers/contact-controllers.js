import { httpCode } from '../helpers/constants.js';
import { handleError } from '../lib/handlerror.js';
import Contact from '../service/schema/contact-schema.js';

async function listContacts(req, res) {
  try {
    const { page, limit, sortBy, sortByDesc, filter } = req.query;

    const option = {
      page: Number(page) || 1,
      limit: Number(limit) || 10,
      sort: {
        ...(sortBy ? { [`${sortBy}`]: 1 } : {}),
        ...(sortByDesc ? { [`${sortByDesc}`]: -1 } : {}),
      },
      select: filter ? filter.split('|').join(' ') : '',
    };

    const contacts = await Contact.paginate({}, option);

    return res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
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
      return res.status(httpCode.NOT_FOUND).json({
        status: 'not found',
        code: httpCode.NOT_FOUND,
        message: 'Not found',
      });
    }

    return res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      data: contact,
    });
  } catch (error) {
    handleError(error);
  }
}

async function addContact(req, res) {
  try {
    const data = req.body;

    const contact = await Contact.create(data);
    const { _id, name, email, phone } = contact;

    return res.status(httpCode.CREATED).json({
      status: 'success',
      code: httpCode.CREATED,
      data: {
        _id,
        name,
        email,
        phone,
      },
      message: 'Contact added',
    });
  } catch (error) {
    handleError(error);
  }
}

async function removeContact(req, res) {
  try {
    const { contactId } = req.params;

    const deletedData = await Contact.deleteOne({ _id: contactId });

    if (deletedData.n === 0) {
      return res.status(httpCode.NOT_FOUND).json({
        status: 'not found',
        code: httpCode.NOT_FOUND,
        message: `Id: ${contactId} not found.`,
        data: 'Bad request.',
      });
    }

    return res.status(httpCode.OK).json({
      status: 'success',
      code: httpCode.OK,
      message: `Contact with id: ${contactId} deleted`,
      deletedData: deletedData.deletedCount,
    });
  } catch (error) {
    handleError(error);
  }
}

async function updateContact(req, res) {
  try {
    const { contactId } = req.params;
    const { body } = req;

    const updatedContact = await Contact.findByIdAndUpdate(contactId, body, {
      new: true,
    });

    if (!updatedContact) {
      return res.status(httpCode.NOT_FOUND).send(`ID: ${contactId} not found.`);
    }

    return res.json({
      status: 'access',
      code: httpCode.OK,
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
  removeContact,
  updateContact,
  addContact,
};
