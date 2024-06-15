import { isDisabled } from "@testing-library/user-event/dist/utils";
import React, { useState, useCallback } from "react";
import { useLocation, useNavigate } from "react-router-dom";

// const mockData = [
//   {
//     id: 0,
//     firstName: "Wilbur",
//     lastName: "Rogers",
//     gender: "Male",
//     dob: "31-12-1988",
//     nationality: "USA",
//   },
//   {
//     id: 1,
//     firstName: "Lorenzo",
//     lastName: "Underwood",
//     gender: "Female",
//     dob: "11-04-1976",
//     nationality: "FRA",
//   },
//   {
//     id: 2,
//     firstName: "Pearl",
//     lastName: "Johnson",
//     gender: "Unknown",
//     dob: "14-05-2001",
//     nationality: "AUS",
//   },
//   {
//     id: 3,
//     firstName: "Russell",
//     lastName: "Patrick",
//     gender: "Male",
//     dob: "21-07-1999",
//     nationality: "USA",
//   },
//   {
//     id: 4,
//     firstName: "Nicolas",
//     lastName: "Watts",
//     gender: "Male",
//     dob: "30-06-2020",
//     nationality: "AUS",
//   },
//   {
//     id: 5,
//     firstName: "Anny",
//     lastName: "Bates",
//     gender: "Female",
//     dob: "18-02-1952",
//     nationality: "DEU",
//   },
// ];

function convertStringToDate(dateString) {
  // Split the string into day, month, and year components (assuming DD-MM-YYYY format)
  if (!dateString) return;
  const dateStr = dateString.split("-");
  const date = new Date(dateStr[2], dateStr[1] - 1, dateStr[0]);
  return date;
}

export const ResultPage = () => {
  // const [data, setData] = useState(mockData);
  const location = useLocation();
  const { dataInit, fileName } = location.state || {};
  const [data, setData] = useState(JSON.stringify(dataInit));
  console.log(dataInit);
  const [indexWantChange, setIndexWantChange] = useState(0);
  const [dataOne, setDataOne] = useState([]);
  const [isDisabled, setIsDisabled] = useState(true);
  const [errorFistName, setErrorFirstName] = useState("");
  const [errorLastName, setErrorLastName] = useState("");
  const [errorNationality, setErrorNationality] = useState("");

  const [date, setDate] = useState("");
  const navigate = useNavigate();
  // const { data, fileName } = location.state || {};
  // console.log(JSON.stringify(data));

  // console.log(fileName);

  // for dev

  // const fileName = "test";
  // const data = mockData;

  const changeData = (index) => {
    const asArray = Object.entries(dataInit);
    const person = asArray.filter(([key, value]) => value["index"] == index);
    setDataOne(person[0][1]);
    // setSubmit(true);
    const date = convertStringToDate(person[0][1].dob);
    console.log(date.toISOString);
    setIsDisabled(false);
    setDate(date.toISOString().split("T")[0]);
    setIndexWantChange(index);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (
      !event.target.firstName ||
      !event.target.lastName ||
      !event.target.dob ||
      !event.target.nationality ||
      !event.target.gender
    ) {
      return;
    }

    const firstName = event.target.firstName.value;
    const lastName = event.target.lastName.value;
    const gender = event.target.gender.value;
    const dob = event.target.dob.value;
    const nationality = event.target.nationality.value;
    const updatePerson = {
      id: indexWantChange,
      firstName,
      lastName,
      gender,
      dob,
      nationality,
    };
    // console.log(data);
    const updatedData = dataInit.map((person, i) =>
      i === indexWantChange ? updatePerson : person
    );
    setData(updatedData);
  };
  const onChangeFirstName = useCallback((event) => {
    const firstName = event.target.value;
    if (!/^[a-zA-Z]{1,20}$/.test(firstName)) {
      setErrorFirstName("Invalid first name no format");
    } else setErrorFirstName("");
  });

  const onChangeLastName = useCallback((event) => {
    const lastName = event.target.value;
    if (!/^[a-zA-Z]{1,20}$/.test(lastName)) {
      setErrorLastName("Invalid last name no format");
    } else setErrorLastName("");
  });

  const onChangeNationality = useCallback((event) => {
    const nationality = event.target.value;
    const regex = /^[A-Z]{3}$/;
    if (!regex.test(nationality)) {
      setErrorNationality("Invalid Nationality");
    } else setErrorNationality("");
  });

  const clear = (e) => {
    e.preventDefault();
    setDataOne([]);
    setDate("");
    setIsDisabled(true);
  };

  const cancel = (e) => {
    e.preventDefault();
    setData([]);
    navigate("/");
  };

  const download = (e) => {
    fetch("http://localhost:4000/download?nameFile=" + fileName, {
      method: "GET",
    }).then((response) => console.log(response));
  };
  return (
    <div>
      <h1>Result Page</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <div>First Name</div>
          <div>
            <input
              type="text"
              name="firstName"
              defaultValue={dataOne.firstName || ""}
              onChange={onChangeFirstName}
            />
          </div>
          {errorFistName && <div style={{ color: "red" }}>{errorFistName}</div>}
        </div>
        <div>
          <div>LastName</div>
          <input
            type="text"
            id="lastName"
            name="lastName"
            defaultValue={dataOne.lastName || ""}
            onChange={onChangeLastName}
          />
          {errorLastName && <div style={{ color: "red" }}>{errorLastName}</div>}
        </div>
        <div>
          <div>Gender</div>
          <select id="cars" name="gender">
            <option>{dataOne.gender}</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
            <option value="Unknow">Unknow</option>
          </select>
        </div>
        <div>
          <div>Nationality</div>
          <input
            type="text"
            id="nationality"
            name="nationality"
            defaultValue={dataOne.nationality || ""}
            onChange={onChangeNationality}
          />
          {errorNationality && (
            <div style={{ color: "red" }}>{errorNationality}</div>
          )}
        </div>
        <div>
          <div>Date of Birth</div>
          <input
            type="date"
            id="dob"
            name="dob"
            defaultValue={date}
            onChange={onChangeLastName}
          />
        </div>
        <button type="submit" name="submit" disabled={isDisabled}>
          Save
        </button>
        <button onClick={clear}>Clear</button>
      </form>
      <table>
        <thead>
          <tr>
            <th>index</th>
            <th>button</th>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Gender</th>
            <th>Date of Birth</th>
            <th>Nationality</th>
          </tr>
        </thead>
        <tbody>
          {dataInit.map((person, index) => (
            <tr key={index}>
              <td>{person.index + 1}</td>
              <button onClick={() => changeData(index)}>Change Data</button>
              <td>{person.firstName}</td>
              <td>{person.lastName}</td>
              <td>{person.gender}</td>
              <td>{person.dob}</td>
              <td>{person.nationality}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button type="submit" onClick={download}>
        {fileName}
      </button>
      <button onClick={cancel}>Cancel</button>
    </div>
  );
};
