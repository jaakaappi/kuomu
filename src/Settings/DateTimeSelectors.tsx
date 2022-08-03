import React, { useState } from "react";
import DatePicker from "react-datepicker";
import { DateTime } from "luxon";

import "react-datepicker/dist/react-datepicker.css";
import { DateContext } from "../App";

const DateTimeSelectors = () => {

  return (
    <>
      <p>Valittu päivä:</p>
      <DateContext.Consumer>
        {({ date, setDate }) => {
          return <DatePicker
            selected={date.toJSDate()}
            onChange={(date) => {
              const newDateTime = DateTime.fromJSDate(date!);
              if (newDateTime.day !== DateTime.local().day) {
                setDate(newDateTime.set({ hour: 0, minute: 0 }));
              } else {
                setDate(newDateTime);
              }
            }}
          />
        }}
      </DateContext.Consumer>
    </>
  );
};

export default DateTimeSelectors;
