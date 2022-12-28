const mongoose = require("mongoose");

const argLength = process.argv.length;

if (argLength < 3) {
  console.log(
    "Please provide the password as an argument: node mongo.js <password>"
  );
  process.exit(1);
} else {
  const personSchema = new mongoose.Schema({
    id: Number,
    name: String,
    number: String,
  });

  const Person = mongoose.model("Person", personSchema);

  const password = process.argv[2];
  const url = `mongodb+srv://ClaudiuManuel:${password}@cluster0.2ptj0i2.mongodb.net/phonebook?retryWrites=true&w=majority`;
  mongoose
    .connect(url)
    .then((result) => {
      console.log("connected");

      if (argLength === 3) {
        Person.find({}).then((result) => {
          console.log("phonebook:");
          result.forEach((person) => {
            console.log(person.name + " " + person.number);
          });
          mongoose.connection.close();
        });
      } else {
        const personName = process.argv[3];
        const personNumber = process.argv[4];
        const person = new Person({
          id: Math.random() * 100,
          name: personName,
          number: personNumber,
        });

        return person.save().then((result) => {
          console.log(
            `added ${personName} number ${personNumber} to phonebook`
          );
          mongoose.connection.close();
        });
      }
    })
    .catch((err) => console.log(err));
}
