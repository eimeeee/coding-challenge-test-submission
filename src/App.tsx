import React, { useState } from "react";

import Address from "@/components/Address/Address";
import AddressBook from "@/components/AddressBook/AddressBook";
import Button from "@/components/Button/Button";
import InputText from "@/components/InputText/InputText";
import Radio from "@/components/Radio/Radio";
import Section from "@/components/Section/Section";
import useAddressBook from "@/hooks/useAddressBook";

import styles from "./App.module.css";
import { Address as AddressType } from "./types";
import useFormFields from "./ui/hooks/useFormFields";
import Form from "@/components/Form/Form";
import transformAddress from "./core/models/address";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

function App() {
  /**
   * Form fields states
   */
  const {
    fields,
    handleChange,
    resetFields,
    setFields
  } = useFormFields({
    postCode: "",
    houseNumber: "",
    firstName: "",
    lastName: "",
    selectedAddress: ""
  });
  
  const { postCode, houseNumber, firstName, lastName, selectedAddress } = fields;
  /**
   * Results states
   */
  const [error, setError] = React.useState<undefined | string>(undefined);
  const [addresses, setAddresses] = React.useState<AddressType[]>([]);
  /**
   * Redux actions
   */
  const { addAddress } = useAddressBook();
  const [loading, setLoading] = useState(false);

  const handleAddressSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setAddresses([]);
    setError(undefined);
    setLoading(true);
  
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_URL}/api/getAddresses?postcode=${postCode}&streetnumber=${houseNumber}`
      );

      if (!res.ok) {
        const errorData = await res.json();
        const message = errorData?.errormessage || "Failed to fetch addresses";
        throw new Error(message);
      }
     
      const data = await res.json();

      const transformed = data.details.map((addr: any) =>
        transformAddress(addr)
      );

      setAddresses(transformed);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handlePersonSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
  
    if (!firstName.trim() || !lastName.trim()) {
      setError("First name and last name fields mandatory!");
      return;
    }
  
    if (!selectedAddress || !addresses.length) {
      setError("No address selected, try to select an address or find one if you haven't");
      return;
    }
  
    const foundAddress = addresses.find((a) => a.id === selectedAddress);
    if (!foundAddress) {
      setError("Selected address not found");
      return;
    }
  
    addAddress({ ...foundAddress, firstName, lastName });
    resetFields();
  };
  

  return (
    <main>
      <Section>
        <h1>
          Create your own address book!
          <br />
          <small>
            Enter an address by postcode add personal info and done! 👏
          </small>
        </h1>
        <Form
          label="🏠 Find an address"
          loading={loading}
          onFormSubmit={handleAddressSubmit}
          submitText="Find"
          formEntries={[
            {
              name: "postCode",
              placeholder: "Post Code",
              extraProps: {
                value: postCode,
                onChange: handleChange,
              },
            },
            {
              name: "houseNumber",
              placeholder: "House number",
              extraProps: {
                value: houseNumber,
                onChange: handleChange,
              },
            },
          ]}
      />
        {addresses.length > 0 &&
          addresses.map((address) => {
            return (
              <Radio
                name="selectedAddress"
                id={address.id}
                key={address.id}
                checked={selectedAddress === address.id} 
                onChange={handleChange}
              >
                <Address {...address} />
              </Radio>
            );
          })}

        {selectedAddress && (
          <Form
            label="✏️ Add personal info to address"
            onFormSubmit={handlePersonSubmit}
            submitText="Add to addressbook"
            loading={loading}
            formEntries={[
              {
                name: "firstName",
                placeholder: "First name",
                extraProps: {
                  value: firstName,
                  onChange: handleChange,
                },
              },
              {
                name: "lastName",
                placeholder: "Last name",
                extraProps: {
                  value: lastName,
                  onChange: handleChange,
                },
              },
            ]}
          />
        )}

        {error && <ErrorMessage message={error} />}

        <Button
          type="button"
          variant="secondary"
          onClick={() => {
            resetFields();
            setAddresses([]);
            setError(undefined);
          }}
        >
          Clear all fields
        </Button>
      </Section>

      <Section variant="dark">
        <AddressBook />
      </Section>
    </main>
  );
}

export default App;
