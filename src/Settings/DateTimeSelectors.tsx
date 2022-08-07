import React, { useContext, useEffect } from "react";
import DatePicker from "react-datepicker";
import { DateTime } from "luxon";
import { registerLocale, setDefaultLocale } from "react-datepicker";
import { fi } from "date-fns/locale";

registerLocale("fi", fi);
setDefaultLocale("fi");

import "react-datepicker/dist/react-datepicker.css";
import { DateContext } from "../App";
import { useSearchParams } from "react-router-dom";

const DateTimeSelectors = () => {
  const [urlQueryParameters, setUrlQueryParameters] = useSearchParams();
  const { date, setDate } = useContext(DateContext);

  useEffect(() => {
    if (urlQueryParameters.get("paiva")) {
      if (
        DateTime.fromFormat(urlQueryParameters.get("paiva")!, "dd-MM-yyyy")
          .isValid
      ) {
        setDate(
          DateTime.fromFormat(urlQueryParameters.get("paiva")!, "dd-MM-yyyy")
        );
      } else {
        let newParameters = urlQueryParameters;
        newParameters.delete("paiva");
        setUrlQueryParameters(newParameters);
      }
    }
  }, []);

  const upsertPaivaParameter = (newDate: DateTime) => {
    let newParameters = urlQueryParameters;
    newParameters.set("paiva", newDate.toFormat("dd-MM-yyyy"));
    setUrlQueryParameters(newParameters);
  };

  return (
    <>
      <p>Valittu päivä:</p>
      <DatePicker
        selected={date.toJSDate()}
        locale="fi"
        minDate={DateTime.local().toJSDate()}
        dateFormat="dd.MM.yyyy"
        onChange={(date) => {
          const newDateTime = DateTime.fromJSDate(date!);
          if (newDateTime.day !== DateTime.local().day) {
            setDate(newDateTime.set({ hour: 0, minute: 0 }));
            upsertPaivaParameter(newDateTime);
          } else {
            setDate(DateTime.local());
          }
        }}
      />
    </>
  );
};

export default DateTimeSelectors;
