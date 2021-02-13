import commander from 'commander';
const { Command } = commander;
const program = new Command();

export default program
  .version('0.0.1')
  .option('-l, --list', 'List contacts')
  .option('-g, --get <id>', 'Get contacts list')
  .option('-r --remove <id>', 'Remove contact from contacts list')
  .option('-a --add', 'Add contact to contacts list')
  .option('-n --name <name>', 'Enter name')
  .option('-e --email <email>', 'Enter email')
  .option('-p --phone <phone>', 'Enter phone');
