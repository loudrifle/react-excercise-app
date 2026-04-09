export enum Constraints {
  TOO_SHORT = "TOO_SHORT",
  NOT_UNIQUE = "NOT_UNIQUE",
}

export type ConstraintsArgs = {
  [Constraints.TOO_SHORT]: [characterLimit?: number];
  [Constraints.NOT_UNIQUE]: [existingValues?: string[]];
};

export type ConstraintFn<key extends Constraints> = (
  value: string,
  ...args: ConstraintsArgs[key]
) => string | null;

export const constraintsMessages: { [key in Constraints]: ConstraintFn<key> } = {
  [Constraints.TOO_SHORT]: (value, characterLimit = 1) =>
    value.trim().length < characterLimit
      ? `Minimum character allowed is ${characterLimit}`
      : null,
  [Constraints.NOT_UNIQUE]: (value, existingValues: string[] = []) =>
    existingValues.includes(value)
      ? `This value "${value}" already exists`
      : null,
};

export type InputConstraint<key extends Constraints = Constraints> = {
  code: key;
  args?: ConstraintsArgs[key];
};

export type InputParameters = {
  label: string;
  required?: boolean;
  constraints?: InputConstraint[];
};

export type Input = {
  [key: string]: InputParameters;
};
