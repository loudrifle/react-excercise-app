"use client";

import { Fragment, useState, useRef } from "react";

enum FieldErrorType {
  /** Must be >= 6 chars */
  TOO_SHORT = "TOO_SHORT",
  NOT_UNIQUE = "NOT_UNIQUE",
  NO_EXCL_MARK = "NO_EXCL_MARK",
}

interface FieldError {
  code: FieldErrorType;
  message: string;
}

const errorMessages: Record<FieldErrorType, string> = {
  [FieldErrorType.TOO_SHORT]: "Must have at least 6 characters",
  [FieldErrorType.NOT_UNIQUE]: "Item already exists",
  [FieldErrorType.NO_EXCL_MARK]: "No exclamation mark allowed!",
};

type FieldErrors = Record<string, FieldError[]>;

type ErrorHandlerParams = [string, FieldErrorType, FieldErrors];

type ErrorHandler = (...params: ErrorHandlerParams) => FieldErrors;

const raiseError: ErrorHandler = (fieldKey, errorCode, allErrors) => {
  const outputObject = { ...allErrors };

  const constraintError: FieldError = {
    code: errorCode,
    message: errorMessages[errorCode],
  };

  if (fieldKey in outputObject) {
    if (!outputObject[fieldKey].some((error) => error.code === errorCode)) {
      outputObject[fieldKey].push(constraintError);
    }
  } else {
    outputObject[fieldKey] = [constraintError];
  }

  return outputObject;
};

const clearError: ErrorHandler = (fieldKey, errorCode, allErrors) => {
  const outputObject = { ...allErrors };

  if (fieldKey in outputObject) {
    const tooShortError = outputObject[fieldKey].findIndex(
      (error) => error.code === errorCode
    );

    if (tooShortError > -1) {
      outputObject[fieldKey].splice(tooShortError, 1);
    }

    if (!outputObject[fieldKey].length) {
      const newObject = {} as typeof outputObject;

      for (const [key, value] of Object.entries(outputObject)) {
        if (key === fieldKey) continue;
        newObject[key] = value;
      }

      return newObject;
    }
  }

  return outputObject;
};

const handleError = (
  action: "raise" | "clear",
  ...params: ErrorHandlerParams
) => {
  const fn = action === "raise" ? raiseError : clearError;
  return fn(...params);
};

export default function HomePage() {
  const [finalFruits, setFinalFruits] = useState<string[]>([]);
  const fieldErrors = useRef<FieldErrors>({});
  const [finalErrors, setFinalErrors] = useState<FieldErrors>({});
  const errorKeys = Object.keys(finalErrors);

  return (
    <Fragment>
      <form
        onSubmit={(ev) => {
          ev.preventDefault();

          setFinalErrors({ ...fieldErrors.current });

          if (!Object.keys(fieldErrors.current).length) {
            const formData = new FormData(ev.currentTarget);

            ev.currentTarget.reset();

            setFinalFruits((prev) => [
              ...prev,
              Object.fromEntries(formData.entries()).fruit as string,
            ]);
          }
        }}
      >
        <label style={{ display: "block" }} htmlFor="fruit">
          Favorite fruit
        </label>

        <input
          required
          type="text"
          id="fruit"
          name="fruit"
          onChange={(ev) => {
            const value = ev.currentTarget.value.trim();

            fieldErrors.current = handleError(
              value.length < 6 ? "raise" : "clear",
              "fruit",
              FieldErrorType.TOO_SHORT,
              fieldErrors.current
            );
          }}
        />

        <button type="submit" style={{ cursor: "pointer", marginLeft: 10 }}>
          Save
        </button>
      </form>

      {!finalFruits.length ? null : (
        <ul>
          {finalFruits.map((fruit, i) => (
            <li key={i}>{fruit}</li>
          ))}
        </ul>
      )}

      {!errorKeys.length ? null : (
        <ul style={{ color: "red" }}>
          {errorKeys.map((fieldKey) => (
            <Fragment key={fieldKey}>
              <li>{fieldKey}:</li>
              <ul>
                {finalErrors[fieldKey].map(({ code, message }) => (
                  <li key={code}>
                    <pre style={{ display: "inline" }}>[{code}]</pre> {message}
                  </li>
                ))}
              </ul>
            </Fragment>
          ))}
        </ul>
      )}
    </Fragment>
  );
}
