"use client";

import React, { useRef } from "react";
import PaymentHistory, { PaymentHistoryRef } from "@/components/PaymentHistory";

const PaymentHistoryPage = () => {
  const paymentHistoryRef = useRef<PaymentHistoryRef>(null);

  return <PaymentHistory ref={paymentHistoryRef} />;
};

export default PaymentHistoryPage;
