import { ChangeEvent } from "react";

export interface InputChangeProps {
  e: ChangeEvent<HTMLInputElement>;
  name: string;
}
