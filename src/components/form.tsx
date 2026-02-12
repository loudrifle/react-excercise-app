import { useForm } from "react-hook-form";

export enum Constraints {
  TOO_SHORT = "TOO_SHORT",
  NOT_UNIQUE = "NOT_UNIQUE",
}

type ConstraintsArgs = {
  [Constraints.TOO_SHORT]: [characterLimit?: number];
  [Constraints.NOT_UNIQUE]: [existingValues?: string[]];
};

type ConstraintFn<key extends Constraints> = (
  value: string,
  ...args: ConstraintsArgs[key]
) => string | null;

const constraintsMessages: { [key in Constraints]: ConstraintFn<key> } = {
  [Constraints.TOO_SHORT]: (value, characterLimit = 1) =>
    value.trim().length < characterLimit
      ? `Minimum character allowed is ${characterLimit}`
      : null,
  [Constraints.NOT_UNIQUE]: (value, existingValues: string[] = []) =>
    existingValues.includes(value)
      ? `This value "${value}" already exists`
      : null,
};

type ErrorMessage<key extends Constraints = Constraints> = {
  code: key;
  message: ReturnType<(typeof constraintsMessages)[key]>;
};

type InputConstraint<key extends Constraints = Constraints> = {
  code: key;
  args?: ConstraintsArgs[key];
};

type InputParameters = {
  label: string;
  required?: boolean;
  constraints?: InputConstraint[];
};

type Input = {
  [key: string]: InputParameters;
};

const validateField = (
  input: InputParameters,
  value: string
): ErrorMessage[] => {
  const errors: ErrorMessage[] = [];

  // check required
  if (input.required && !value?.trim()) {
    errors.push({
      code: Constraints.TOO_SHORT,
      message: "This field is required",
    });
  }

  if (input.constraints) {
    for (const constraint of input.constraints) {
      const message = runConstraint(constraint, value);
      if (message) errors.push({ code: constraint.code, message });
    }
  }

  return errors;
};

function runConstraint<K extends Constraints>(
  constraint: InputConstraint<K>,
  value: string
): string | null {
  const fn: ConstraintFn<K> = constraintsMessages[constraint.code];
  return fn(value, ...(constraint.args ?? []));
}

export const Form = ({ fields }: { fields: Input }) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<{ [key: string]: string }>({ mode: "onBlur" });

  const onSubmit = (data: any) => {
    console.log(data);
  };
  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ display: "inline-block" }}>
      {Object.entries(fields).map(([name, params]) => (
        <div key={name} style={{ display: "block" }}>
          <label htmlFor={name}>{params.label}</label>
          <input
            type="text"
            id={name}
            {...register(name, {
              validate: (value) => {
                const errors = validateField(params, value);
                if (errors.length > 0) {
                  // Creiamo un oggetto con tutti i messaggi
                  return errors.map((e) => e.message).join(", ");
                }
                return true;
              },
            })}
          />
          {errors[name] && (
            <p style={{ color: "red" }}>{errors[name]?.message}</p>
          )}
        </div>
      ))}
      <button type="submit">Save</button>
    </form>
  );
};
