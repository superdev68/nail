import rawMerchant from "./merchant.json";
import { IMerchant } from "../lib/types/merchant";

export const merchantData: IMerchant = rawMerchant as unknown as IMerchant;
export default merchantData;
