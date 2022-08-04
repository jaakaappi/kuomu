import React from "react";
import DatePicker from "react-datepicker";
import { DateTime } from "luxon";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { fi } from "date-fns/locale";

registerLocale("fi", fi);
setDefaultLocale("fi");

import "react-datepicker/dist/react-datepicker.css";
import { DateContext } from "../App";

const DateTimeSelectors = () => {
  return (
    <>
      <p>Valittu päivä:</p>
      <DateContext.Consumer>
        {({ date, setDate }) => {
          return (
            <DatePicker
              selected={date.toJSDate()}
              locale="fi"
              minDate={DateTime.local().toJSDate()}
              dateFormat="dd.MM.yyyy"
              onChange={(date) => {
                const newDateTime = DateTime.fromJSDate(date!);
                if (newDateTime.day !== DateTime.local().day) {
                  setDate(newDateTime.set({ hour: 0, minute: 0 }));
                } else {
                  setDate(DateTime.local());
                }
              }}
            />
          );
        }}
      </DateContext.Consumer>
    </>
  );
};

export default DateTimeSelectors;
