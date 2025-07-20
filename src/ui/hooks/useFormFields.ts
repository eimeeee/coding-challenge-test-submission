import { useState, ChangeEvent } from "react";

function useFormFields<T extends Record<string, any>>(initialValues: T) {
  const [fields, setFields] = useState<T>(initialValues);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFields((prev) => ({ ...prev, [name]: value }));
  };

  const resetFields = () => setFields(initialValues);

  return { fields, handleChange, resetFields, setFields };
}

export default useFormFields;
