import React from "react";
import { SurveyStatus } from "../../model/status.model";

interface Props {
  status: SurveyStatus;
  variant: "large" | "medium" | "small";
}

export default function StatusCircle(props: Props) {
  const size = {
    "large": 16,
    "medium": 13,
    "small": 10
  };
  const backgroundColor = {
    [SurveyStatus.Clear]: "#00FF00",
    [SurveyStatus.Coming]: "#FFE500",
    [SurveyStatus.Loss]: "#FF0000",
  };

  return (
    <div style={{
      width: `${size[props.variant]}px`,
      height: `${size[props.variant]}px`,
      backgroundColor: backgroundColor[props.status],
      backgroundSize: "cover",
      borderRadius: "100%"
    }} />
  );
}