import { Alert } from "react-bootstrap";
import React from "react";

export default function MessageBox({
  variant = "info",
  children,
}: {
  variant?: string;
  children: React.ReactNode;
}) {
  // Renders an Alert with a variant and children passed as props
  return <Alert variant={variant || "info"}>{children}</Alert>;
}
