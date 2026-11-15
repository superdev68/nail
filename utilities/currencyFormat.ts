import { formatMoneyNumber } from "./bookingUtils";

export const currencyFormat = (price?: number): string => {
  return formatMoneyNumber(price);
};
