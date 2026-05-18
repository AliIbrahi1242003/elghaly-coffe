"use client";

import { useState } from "react";
import {
  CheckoutFormData,
  FormErrors,
  validateCheckoutForm,
  isFormValid,
} from "@/lib/checkoutValidation";
import { createOrder } from "@/app/actions/orders";
import { CartItem } from "@/lib/cart";

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

    const handleSubmit = async (
    items: CartItem[],
    totalPrice: number,
    onSuccess?: (orderId: number) => void,
  ) => {
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await createOrder(formData, items, totalPrice);
      if (result.success && result.orderId) {
        if (onSuccess) onSuccess(result.orderId);
      } else {
        console.error("Order creation failed:", result.error);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
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
