import contacts from './modules/contacts.js';
import program from './lib/commander.js';

program.parse(process.argv);

const options = program.opts();

console.log(options);

function invokeOptions(options) {
  if (options.list) {
    contacts.listContacts();
  } else if (options.get) {
    const id = Number(options.get);

    contacts.getContactById(id);
  } else if (options.remove) {
    const id = Number(options.remove);

    contacts.removeContact(id);
  } else if (options.add) {
    const { name, email, phone } = options;

    contacts.addContact(name, email, phone);
  } else {
    console.warn('\x1B[31m Unknown action type!');
  }
}

invokeOptions(options);
