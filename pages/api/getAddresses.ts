import type { NextApiRequest, NextApiResponse } from "next";

import generateMockAddresses from "../../src/utils/generateMockAddresses";

const isStrictlyNumeric = (value: string) => {
  return /^\d+$/.test(value);
};

const validateField = (name: string, value: any, minLength = 1) => {
  if (!value) {
    return `${name} fields mandatory!`;
  }
  if (value.length < minLength) {
    return `${name} must be at least ${minLength} digits!`;
  }
  if (!isStrictlyNumeric(value)) {
    return `${name} must be all digits and non negative!`;
  }
  return null;
};

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const {
    query: { postcode, streetnumber },
  } = req;

  if (!postcode || !streetnumber) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode and street number fields mandatory!",
    });
  }

  if (postcode.length < 4) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: "Postcode must be at least 4 digits!",
    });
  }

  const postcodeError = validateField("Postcode", postcode, 4);
  
  if (postcodeError) {
    return res.status(400).send({
      status: "error",
      // DO NOT MODIFY MSG - used for grading
      errormessage: postcodeError,
    });
  }

  const streetError = validateField("Street Number", streetnumber);

  if (streetError) {
    return res.status(400).send({
      status: "error",
      errormessage: streetError,
    });
  }

  const mockAddresses = generateMockAddresses(
    postcode as string,
    streetnumber as string
  );
  if (mockAddresses) {
    const timeout = (ms: number) => {
      return new Promise((resolve) => setTimeout(resolve, ms));
    };

    // delay the response by 500ms - for loading status check
    await timeout(500);
    return res.status(200).json({
      status: "ok",
      details: mockAddresses,
    });
  }

  return res.status(404).json({
    status: "error",
    // DO NOT MODIFY MSG - used for grading
    errormessage: "No results found!",
  });
}
