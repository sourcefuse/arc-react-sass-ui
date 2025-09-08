import { http, HttpResponse } from "msw";

const baseURL = "http://localhost:3000"; // Add a base URL

export const handlers = [
  http.post(`${baseURL}/tenants`, () => {
    return HttpResponse.json({
      name: "test",
      status: 1,
      key: "ewew078s2i",
      domains: ["sourcefuse.com"],
      lang: "English",
      contacts: [
        {
          firstName: "test",
          lastName: "t",
          email: "test.t+1@sourcefuse.com",
          isPrimary: true,
          designation: "Employee",
          phoneNumber: "2112121",
          countryCode: "+91",
        },
      ],
    });
  }),
];
