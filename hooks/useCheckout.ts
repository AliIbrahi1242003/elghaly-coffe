"use client";

import { useState } from "react";
import {
  CheckoutFormData,
  FormErrors,
  validateCheckoutForm,
  isFormValid,
} from "@/lib/checkoutValidation";

export const useCheckout = () => {
  const [formData, setFormData] = useState<CheckoutFormData>({
    firstName: "",
    lastName: "",
    phoneNumber: "",
    governorate: 0,
    city: "",
    detailedAddress: "",
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (
    field: keyof CheckoutFormData,
    value: string | number,
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Clear error for this field when user starts typing
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors = validateCheckoutForm(formData);
    setErrors(newErrors);
    return isFormValid(newErrors);
  };

  const handleSubmit = async (onSuccess?: (data: CheckoutFormData) => void) => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      // TODO: Send form data to backend
      console.log("Checkout data:", formData);
      if (onSuccess) {
        onSuccess(formData);
      }
    } catch (error) {
      console.error("Checkout error:", error);
      setErrors({ firstName: "An error occurred. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      firstName: "",
      lastName: "",
      phoneNumber: "",
      governorate: 0,
      city: "",
      detailedAddress: "",
    });
    setErrors({});
  };

  return {
    formData,
    errors,
    isSubmitting,
    updateField,
    validateForm,
    handleSubmit,
    resetForm,
  };
};
