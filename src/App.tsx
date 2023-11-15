import * as React from 'react';
import { lazy, Suspense, useEffect } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from "react-router-dom";

import ProtectedRoute from './core/components/ProtectedRoute';
import { useAppDispatch, useAppSelector } from './core/hooks/rtkHooks';
import { loadBackgroundSuveyBasicData } from './core/store/slices/backgroundSurveySlice';
import { loadBackgroundAdultSuveyBasicData } from './core/store/slices/backgroundAdultSurveySlice';
import { loadFollowUpSuveyBasicData } from './core/store/slices/followUpSurveySlice';
import { fetchUserBytoken } from './core/store/slices/userSlice';
import { backgroundSurveyPath, estimatesPath, followUpSurveyPath, forgotPasswordPath, homePath, loginPath, registerPath, settingsPath, systematicFollowUpPath, adminPath, backgroundAdultSurveyPath, adultCaseList, estimatesAdultPath, adultSystematicFollowUpPath, caseListPath } from './core/util/pathBuilder.util';
import ForgotPasswordPage from './pages/auth/ForgotPasswordPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
const BackgroundDataSurveyPage = lazy(() => import('./pages/background-data-survey/BackgroundDataSurveyPage'));
// import BackgroundDataSurveyPage from './pages/background-data-survey/BackgroundDataSurveyPage';
import { loadCaseListData } from "./core/store/slices/caseListSlice";
import CaseListPage from './pages/dashboard/CaseListPage';
import EstimatesPage from './pages/dashboard/EstimatesPage';
import SettingsPage from './pages/dashboard/SettingsPage';
import SystematicFollowUpPage from './pages/dashboard/SystematicFollowUpPage';
import FollowUpSurveyPage from './pages/follow-up-survey/FollowUpSurveyPage';
import AdminPage from './pages/dashboard/AdminPage';
import CaseListAdultPage from './pages/dashboard/CaseListAdultPage';
import EstimatesAdultPage from './pages/dashboard/EstimatesAdultPage';
import AdultSystematicFollowUpPage from './pages/dashboard/AdultSystematicFollowUpPage';
const BackgroundAdultDataSurveyPage = lazy(() => import('./pages/background-adult-data-survey/BackgroundAdultDataSurveyPage'));

// import PDFPrintPage from './pages/pdf-print-privacy/PDFPrintPage';

export default function App() {
  const dispatch = useAppDispatch();

  const { isSuccess } = useAppSelector(state => state.user);
  const { currentEstimates } = useAppSelector(state => state.backgroundSurvey);
  const { currentEstimatesAdult } = useAppSelector(state => state.backgroundAdultSurvey);


  useEffect(() => {
    dispatch(fetchUserBytoken());
  }, []);

  useEffect(() => {
    if (isSuccess) {
      dispatch(loadCaseListData());
      dispatch(loadBackgroundSuveyBasicData());
      dispatch(loadBackgroundAdultSuveyBasicData());
      dispatch(loadFollowUpSuveyBasicData());
    }
  }, [isSuccess]);

  const router = createBrowserRouter([
    {
      path: loginPath(),
      element: <LoginPage />
    },
    {
      path: registerPath(),
      element: <RegisterPage />
    },
    {
      path: forgotPasswordPath(),
      element: <ForgotPasswordPage />
    },
    {
      path: homePath(),
      element: <ProtectedRoute>
        <CaseListPage />
      </ProtectedRoute>
    },
    {
      path: adultCaseList(),
      element: <ProtectedRoute>
        <CaseListAdultPage />
      </ProtectedRoute>
    },
    {
      path: caseListPath(),
      element: <ProtectedRoute>
        <CaseListPage />
      </ProtectedRoute>
    },
    {
      path: systematicFollowUpPath(),
      element: <ProtectedRoute>
        <SystematicFollowUpPage />
      </ProtectedRoute>
    },
    {
      path: adultSystematicFollowUpPath(),
      element: <ProtectedRoute>
        <AdultSystematicFollowUpPage />
      </ProtectedRoute>
    },
    {
      path: backgroundSurveyPath(),
      element: <ProtectedRoute>
        <Suspense fallback={<>Loading...</>}>
          <BackgroundDataSurveyPage />
        </Suspense>
      </ProtectedRoute>
    },
    {
      path: backgroundAdultSurveyPath(),
      element: <ProtectedRoute>
        <Suspense fallback={<>Loading...</>}>
          <BackgroundAdultDataSurveyPage />
        </Suspense>
      </ProtectedRoute>
    },
    {
      path: estimatesPath(),
      element:
        // currentEstimates ? 
        <ProtectedRoute>
          <EstimatesPage />
        </ProtectedRoute>
      // : <Navigate to={homePath()} />
    },
    {
      path: estimatesAdultPath(),
      element:
        // currentEstimatesAdult ? 
        <ProtectedRoute>
          <EstimatesAdultPage />
        </ProtectedRoute>
      // : <Navigate to={homePath()} />
    },
    {
      path: settingsPath(),
      element: <ProtectedRoute>
        <SettingsPage />
      </ProtectedRoute>
    },
    {
      path: adminPath(),
      element: <ProtectedRoute>
        <AdminPage />
      </ProtectedRoute>
    },
    // {
    //   path: pdfPrintPath(),
    //   element: <ProtectedRoute>
    //     <PDFPrintPage children={undefined} />
    //   </ProtectedRoute>
    // },
    {
      path: followUpSurveyPath(),
      element: <ProtectedRoute>
        <Suspense fallback={<>Loading...</>}>
          <FollowUpSurveyPage />
        </Suspense>
      </ProtectedRoute>
    }
  ]);

  return <RouterProvider router={router} />;
}
