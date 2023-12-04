import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton, Stack, Typography } from '@mui/material';
import dayjs from 'dayjs';
import * as React from 'react';
import { toast } from "react-hot-toast";
import { useTranslation } from "react-i18next";
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from "../../hooks/rtkHooks";
import { BackgroundData } from "../../model/backgroundData.model";
import { BackgroundAdultData } from "../../model/backgroundAdultData.model";
import { loadCaseListData } from "../../store/slices/caseListSlice";
import { backgroundSurveyPath, homePath, backgroundAdultSurveyPath, settingsPath, estimatesPath } from '../../util/pathBuilder.util';
import { ButtonPrimary } from '../button/Button';
import { fetchAPI } from "../../api/fetch-api";
import ReactToPrint from "react-to-print";
import { useRef, useState } from "react";
import ComponentToPrint from './PrintModal';
import ComponentToPrint1 from './PrintModal1';
import { API_URL, QUESTIONNAIRES_URL } from '../../constants/base.const';
import axios from 'axios';

type CloseStatusEntity = {
  codeNumber: string;
  processor: string;
  isClosed: string;
};

interface Props {
  open: boolean;
  onClose: () => void;
  choose: string;
  strNumber: string;
}
export default function NewClientModal(props: Props) {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { username } = useAppSelector(state => state.user);
  const [valueShowableButton, setValueShowableButton] = React.useState(false);
  const strCodeNumber = `${props.choose}${dayjs().format("YYYY")}-${props.strNumber}`;
  const [closeStatusEntity, setCloseStatusEntity] = useState<CloseStatusEntity>();

  const handleClickBackgroundSurvey = () => {
    navigate(backgroundSurveyPath(strCodeNumber));
    //
    const codeNumber = strCodeNumber;
    const processor = username;
    const isClosed = "false"
    axios.post(
      `${API_URL}/close-status/create`,
      {
        ...closeStatusEntity,
        codeNumber,
        processor,
        isClosed
      },
    ).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
    // navigate(estimatesPath(strCodeNumber));
    //
  };

  const handleClickBackgroundAdultSurvey = () => {
    navigate(backgroundAdultSurveyPath(strCodeNumber));
    //
    const codeNumber = strCodeNumber;
    const processor = username;
    const isClosed = "false"
    axios.post(
      `${API_URL}/close-status-adult/create`,
      {
        ...closeStatusEntity,
        codeNumber,
        processor,
        isClosed
      },
    ).then(res => {
      console.log(res);
    }).catch(err => {
      console.log(err);
    });
    //
  };

  const handleClickCreate = () => {
    setValueShowableButton(!valueShowableButton);
  };

  const handleClickRegisterAsAbsent = async () => {
    const payload: BackgroundData = {
      codeNumber: strCodeNumber,
      date: dayjs().format("YYYY-MM-DD"),
      yearOfBirth: dayjs().get("year"),
      country: "Sweden",
      formDataByEntityName: {}
    };

    try {
      await fetchAPI({
        url: `/background-data/create`,
        method: "POST",
        body: payload
      });
      //
      const codeNumber = strCodeNumber;
      const processor = username;
      const isClosed = "false"
      axios.post(
        `${API_URL}/close-status/create`,
        {
          ...closeStatusEntity,
          codeNumber,
          processor,
          isClosed
        },
      ).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
      //

      toast.success("Saved successfully.");
      props.onClose();
      await dispatch(loadCaseListData());
      navigate(homePath());
    }
    catch (e) {
      console.log(e);
      toast.error("Error.");
    }
  };

  const handleClickAdultRegisterAsAbsent = async () => {
    const payload: BackgroundAdultData = {
      codeNumber: strCodeNumber,
      date: dayjs().format("YYYY-MM-DD"),
      yearOfBirth: dayjs().get("year"),
      country: "Sweden",
      formDataByEntityName: {}
    };

    try {
      await fetchAPI({
        url: `/background-adult-data/create`,
        method: "POST",
        body: payload
      });
      //
      const codeNumber = strCodeNumber;
      const processor = username;
      const isClosed = "false"
      axios.post(
        `${API_URL}/close-status-adult/create`,
        {
          ...closeStatusEntity,
          codeNumber,
          processor,
          isClosed
        },
      ).then(res => {
        console.log(res);
      }).catch(err => {
        console.log(err);
      });
      //

      toast.success("Saved successfully.");
      props.onClose();
      await dispatch(loadCaseListData());
      navigate(homePath());
    }
    catch (e) {
      console.log(e);
      toast.error("Error.");
    }
  };
  const componentRef = useRef<ComponentToPrint>(null);
  const componentRef1 = useRef<ComponentToPrint1>(null);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="new-client-modal"
      aria-describedby="description"
      fullWidth={true}
      maxWidth="xs"
      PaperProps={{ sx: { borderRadius: "30px", padding: "8px" } }}
    >
      <DialogTitle sx={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center"
      }}>
        <Typography color="#006D56" variant='h5' component='p'>{t("Word.CodeNumber")}</Typography>
        <IconButton
          aria-label='close'
          onClick={props.onClose}
        >
          <CancelIcon />
        </IconButton>
      </DialogTitle>

      <Divider variant='middle' />

      <DialogContent>
        <Box sx={{
          backgroundColor: "#E6E6E6",
          textAlign: "center",
          padding: "12px",
          borderRadius: "40px",
          width: "100%",
          marginBottom: "24px"
        }}>
          {strCodeNumber}
        </Box>
        <Stack direction="row" gap={4} alignItems="center">
          <Stack sx={{ display: valueShowableButton ? "inline" : "none" }}>
            {props.choose === 'Bof' ? (
              <ButtonPrimary sx={{ width: "380px" }} onClick={handleClickBackgroundSurvey}>{t("NewClientModal.Go To BackgroundSurvey")}</ButtonPrimary>
            ) : (
              <ButtonPrimary sx={{ width: "380px" }} onClick={handleClickBackgroundAdultSurvey}>{t("NewClientModal.Go To BackgroundSurvey")}</ButtonPrimary>
            )}
          </Stack>
          <Stack sx={{ display: valueShowableButton ? "none" : "inline" }}>
            <ReactToPrint
              trigger={() => <ButtonPrimary onClick={handleClickCreate} >{t("NewClientModal.Create")}</ButtonPrimary>}
              content={() => props.choose === 'Bof' ? componentRef.current : componentRef1.current}
              onBeforePrint={handleClickCreate}
            />
          </Stack>
          {/* component to be printed */}
          <Stack sx={{ display: "none" }}>
            <ComponentToPrint
              ref={componentRef}
              uri={strCodeNumber}
            />
            <ComponentToPrint1
              ref={componentRef1}
              uri={strCodeNumber}
            />
          </Stack>
          {props.choose === 'Bof' ? (
            <ButtonPrimary sx={{ display: valueShowableButton ? "none" : "inline" }} onClick={handleClickRegisterAsAbsent}>{t("NewClientModal.RegisterAsAbsent")}</ButtonPrimary>
          ) : (
            <ButtonPrimary sx={{ display: valueShowableButton ? "none" : "inline" }} onClick={handleClickAdultRegisterAsAbsent}>{t("NewClientModal.RegisterAsAbsent")}</ButtonPrimary>
          )}
        </Stack>
      </DialogContent>
    </Dialog >
  );
}
