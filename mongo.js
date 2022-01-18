const mongoose = require('mongoose');

if (process.argv.length < 3) {
  console.log('Please provide the password as an argument');
  process.exit();
}

const password = process.argv[2];

const url = `mongodb+srv://blackstart:${password}@cluster0.46jl5.mongodb.net/Phonebook?retryWrites=true&w=majority`;

mongoose.connect(url);

const personSchema = new mongoose.Schema({
  id: Number,
  name: String,
  number: Number,
});
const name = process.argv[3];
const number = process.argv[4];

const Person = mongoose.model('person', personSchema);

const person = new Person({
  name: name,
  number: number,
});

if (process.argv.length < 4) {
  Person.find({}).then((res) => {
    console.log('phonebook:');
    res.forEach((person) => {
      console.log(`${person.name} ${person.number}`);
    });
    mongoose.connection.close();
  });
  return;
}
person.save().then((res) => {
  console.log(`added ${person.name} number ${person.number} to phonebook`);
  mongoose.connection.close();
});
