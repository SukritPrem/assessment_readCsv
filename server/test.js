const { json } = require("express");

// Define the function to validate CSV data
const validateCSVData = (fileContent) => {
  // Split file content into lines and skip the header line
  const lines = fileContent.trim().split("\n").slice(1);

  const isValidDate = (dateStr) => {
    // Validate date format (dd-mm-yyyy)
    const regex = /^(\d{2})-(\d{2})-(\d{4})$/;
    if (!regex.test(dateStr)) return false;

    // Validate if it's a valid date
    dateStr = dateStr.split("-");
    const date = new Date(dateStr[2], dateStr[1] - 1, dateStr[0]);
    if (isNaN(date.getTime())) return false;

    // Validate date is not in future
    const now = new Date();
    return date <= now;
  };

  const isValidNationality = (nationality) => {
    // Validate nationality format (A-Z and length 3)
    // console.log(nationality);
    const regex = /^[A-Z]{3}$/;
    // console.log(regex.test(nationality));
    return regex.test(nationality);
  };

  const isValidGender = (gender) => {
    // Validate gender values
    const validGenders = ["Male", "Female", "Unknown"];
    return validGenders.includes(gender);
  };
  const jsonData = [];
  const errors = [];

  lines.forEach((line, index) => {
    const fields = line.split(",");
    let messageError = "";
    if (fields.length !== 5) {
      messageError = `Row ${index + 2} Invalid number of fields`;
    }

    const [firstName, lastName, gender, dob, nationality] = fields;

    // Validate first name
    if (!/^[a-zA-Z]{1,20}$/.test(firstName)) {
      if (messageError.length > 0) messageError = messageError + ",First name";
      else messageError = `Row ${index + 2} Invalid First name`;
    }

    // Validate last name
    if (!/^[a-zA-Z]{1,20}$/.test(lastName)) {
      if (messageError.length > 0) messageError = messageError + ",Last name";
      else messageError = `Row ${index + 2} Invalid Last name`;
    }

    // Validate gender
    if (!isValidGender(gender)) {
      if (messageError.length > 0) messageError = messageError + ",gender";
      else messageError = `Row ${index + 2} Invalid gender`;
    }

    // Validate date of birth
    if (!isValidDate(dob)) {
      if (messageError.length > 0)
        messageError = messageError + ",Date of birth";
      else messageError = `Row ${index + 2} Invalid Date of birth`;
    }

    // Validate nationality
    const n = nationality.trim();
    if (!isValidNationality(n)) {
      if (messageError.length > 0) messageError = messageError + ",Nationality";
      else messageError = `Row ${index + 2} Invalid Nationality`;
    }

    const person = {
      index,
      firstName,
      lastName,
      gender,
      dob,
      nationality: n,
    };
    if (messageError.length > 0) {
      errors.push(messageError);
      messageError = "";
    }
    jsonData.push(person);
  });
  return { errors, jsonData };
};

// Export the function to be used in other files
module.exports = validateCSVData;
