import { I18n, TLocales } from "@infernus/core";
import pl_PL from "./locales/pl-PL.json";


export const locales: TLocales = {
  ["pl_PL"]: pl_PL,
};

export const localesTitle = {
  ["pl_PL"]: {
    ["pl_PL"]: "Polski",
  },
};
export const { $t } = new I18n("pl_PL", locales);