export const deliveryPolicy: {
  readonly version: string;
  readonly source: string;
  readonly standardPence: number;
  readonly standardDispatchDays: number[];
  readonly expressPence: number;
  readonly expressDispatchDays: number[];
  readonly removalPence: number;
  readonly madeToOrderWeeks: number[];
  readonly confirmationRequired: boolean;
};
export function normalisePostcode(value: string): string | null;
export function estimateDelivery(value: string): {
  status: "invalid" | "review" | "estimate";
  postcode: string | null;
  costPence: number | null;
  message: string;
};
