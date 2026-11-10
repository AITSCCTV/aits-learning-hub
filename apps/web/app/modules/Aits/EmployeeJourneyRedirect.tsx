import { Navigate, useLocation } from "@remix-run/react";

import { useCurrentUser } from "~/api/queries/useCurrentUser";

import { isEmployeeLearner } from "./employee-learning";

import type { PropsWithChildren } from "react";

export function EmployeeJourneyRedirect({ children }: PropsWithChildren) {
  const { data: user } = useCurrentUser();
  const { pathname } = useLocation();
  if (user && isEmployeeLearner(user.permissions) && ["/dashboard", "/courses"].includes(pathname))
    return <Navigate to="/learn" replace />;
  return <>{children}</>;
}
