import { v4 as uuid } from "uuid";

export const generateID = (char) => {
  const id = uuid();
  const finalid = `${char}${id}`
    .split("-")
    .join("")
    .substring(0, 10)
    .toUpperCase();

  return finalid;
};
