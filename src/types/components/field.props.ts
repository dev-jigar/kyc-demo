export type FieldProps = {
  label?: string;
  required?: boolean;
  errorMessage?: string;
  children: React.ReactNode;
};

export type BaseFiledProps = Omit<FieldProps, "children">;
