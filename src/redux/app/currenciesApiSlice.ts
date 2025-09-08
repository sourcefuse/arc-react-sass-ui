import { apiSlice } from "../apiSlice";
import { ApiSliceIdentifier } from "Constants/enums";
import { Currency } from "./types/plan.type";

const apiSliceIdentifier = ApiSliceIdentifier.TENANT_FACADE;

export const currenciesApiSlice = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getCurrency: builder.query<Currency[], void>({
      query: () => ({
        url: `/currencies`,
        apiSliceIdentifier,
      }),
    }),
  }),
});

export const { useGetCurrencyQuery, useLazyGetCurrencyQuery } =
  currenciesApiSlice;
