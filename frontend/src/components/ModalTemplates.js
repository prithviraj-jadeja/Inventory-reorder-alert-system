//create some modal templates for reuse

import { ModalPrototype } from "./ModalPrototype";

export const successModal = new ModalPrototype({
  title: "Success",
  message: "Operation completed successfully!",
  type: "success",
});

export const errorModal = new ModalPrototype({
  title: "Error",
  message: "Something went wrong. Please, try again.",
  type: "error",
});