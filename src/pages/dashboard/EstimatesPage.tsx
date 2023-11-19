import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Grid from "@mui/material/Grid";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import axios from 'axios';
import dayjs from "dayjs";
import { saveAs } from "file-saver";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from 'react-query';
import { Link, useNavigate } from "react-router-dom";

import { ButtonPrimary, ButtonRed } from "../../core/components/button/Button";
import QRCodeModal from '../../core/components/modal/QRCodeModal';
import StatusChip from "../../core/components/status/StatusChip";
import { API_URL, QUESTIONNAIRES_URL } from '../../core/constants/base.const';
import { useAppDispatch, useAppSelector } from "../../core/hooks/rtkHooks";
import { useFollowUpData } from "../../core/hooks/useFollowUpData";
import DashboardLayout from "../../core/layout/DashboardLayout";
import { EstimatesDto, OccasionIndex, PersonIndex } from '../../core/model/estimates.model';
import { OrsAndScore15WithOccasion } from '../../core/model/score.model';
import { SurveyStatus } from "../../core/model/status.model";
import { backgroundSurveyPath, estimatesPath, followUpSurveyPath } from "../../core/util/pathBuilder.util";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Fab } from '@mui/material';
import toast from 'react-hot-toast';
import { fetchAPI } from '../../core/api/fetch-api';
import { FollowUpData } from '../../core/model/followUpData.model';
import { BackgroundMetadata } from '../../core/model/backgroundData.model';
import { closeStatusListData } from '../../core/store/slices/closeStatusSlice';
import { useParams } from 'react-router-dom';
import { setCurrentEstimatesAction } from '../../core/store/slices/backgroundSurveySlice';
import { GridRowParams } from '@mui/x-data-grid';
import { loadCaseListData } from "../../core/store/slices/caseListSlice";

type CloseStatusEntity = {
  codeNumber: string;
  processor: string;
  isClosed: string;
};

interface ScanLinkProps {
  disabled: boolean;
  onClick: () => void;
}

const ScanLink = ({
  disabled,
  onClick
}: ScanLinkProps) => {
  return (
    <Box
      sx={{
        textDecoration: disabled ? "none" : "underline",
        textTransform: "capitalize",
        color: disabled ? "text.primary" : "success.main",
        fontWeight: "bold",
        padding: 0,
        cursor: disabled ? "not-allowed" : "pointer"
      }}
      onClick={() => (!disabled && onClick())}
    >
      Scan
    </Box>
  );
};

export default function EstimatesPage() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { username } = useAppSelector(state => state.user);
  const { closeStatusList } = useAppSelector(state => state.closeStatusIn);
  const [currentEstimates, setCurrentEstimates] = useState<EstimatesDto | undefined>();
  const codenumber = useParams().codeNumber
  console.log("FFFFFFFFFFF:", codenumber)
  const { caseList } = useAppSelector(state => state.caseListSurvey);
  // const [loadestimates, setLoadestimates] = useState<EstimatesDto | undefined>();
  // useEffect(() => {
  //   const loadestimates = useAppSelector(state => state.backgroundSurvey.currentEstimates);
  //   setLoadestimates(loadestimates);
  // }, [])

  // const refreshPage = (e: GridRowParams<EstimatesDto>) => {
  //   dispatch(setCurrentEstimatesAction(e.row));
  // };

  const currentEstimatesDatas = caseList.find(item => item.codeNumber === codenumber);
  // console.log("HHHHHHHHHHHH:::::::", currentEstimatesDatas)
  // setCurrentEstimates(currentEstimatesDatas);
  console.log("currentEstimatesDatas:::::", currentEstimatesDatas)
  // const currentEstimates = useAppSelector(state => state.backgroundSurvey.currentEstimates);
  // const currentEstimates = setCurrentEstimatesAction;
  // const currentEstimates = loadestimates;
  const {
    data: followUpData,
    isFetched: isFetchedFollowUpData
  } = useFollowUpData(codenumber);
  const completedFollowUpSurvey = isFetchedFollowUpData && !!followUpData?.codeNumber;

  const [showQRCodeModal, setShowQRCodeModal] = useState(false);
  const [targetURI, setTargetURI] = useState("");
  const [qrcodeUriDomain, setQrcodeUriDomain] = useState("");
  const [closedButton, setClosedButton] = useState<undefined | string>("false");
  const [closeStatusEntity, setCloseStatusEntity] = useState<CloseStatusEntity>();

  const [makeCodeNumber, setMakeCodeNumber] = useState("");


  const { data: scores } = useQuery<OrsAndScore15WithOccasion[]>("getScoresByCodeNumberAndOccasion", () =>
    axios.post(
      `${API_URL}/score/getScoresByCodeNumberAndOccasion`,
      {
        codeNumber: codenumber
      }
    ).then(res => res.data)
  );

  const handleClickScanLink = (person: PersonIndex, occasion: OccasionIndex) => {
    setTargetURI(btoa(btoa(btoa(JSON.stringify({
      codeNumber: codenumber,
      person,
      occasion,
      score15: 0,
      ors: 0
    })))));
    setShowQRCodeModal(true);
    setQrcodeUriDomain(QUESTIONNAIRES_URL);
  };

  const handleClickImportantEventsScanLink = () => {
    setTargetURI(btoa(btoa(btoa(JSON.stringify({
      codeNumber: codenumber,
    })))));
    setShowQRCodeModal(true);
    setQrcodeUriDomain("https://imp.vallentuna.eagle.productions");
  };

  const handleClickFillOutFollowUpSurvey = () => {
    navigate(followUpSurveyPath(codenumber));
  };

  const handleClickSendSurvey = async (occasion: OccasionIndex | 0) => {
    console.log("before post");
    const { data } = await axios({
      method: "POST",
      url: `${API_URL}/background-data/download-docx`,
      data: {
        codeNumber: codenumber,
        occasion: occasion
      },
      responseType: "blob"
    });
    console.log("docx", data.codeNumber)

    saveAs(data, "survey.docx");
  };

  useEffect(() => {
    // setMakeCodeNumber(JSON.stringify(codenumber).slice(15, -2));
    // console.log("GGGGGGGG:", JSON.stringify(codenumber).slice(15, -2))
    setCurrentEstimates(currentEstimatesDatas);
    // dispatch(loadCaseListData());
    setMakeCodeNumber(String(codenumber))
    console.log(String(codenumber))
    const closeStatus = (closeStatusList.find((item) => item.codeNumber === codenumber))?.isClosed
    setClosedButton(closeStatus === null ? "false" : closeStatus);
    console.log("closed status:", closeStatus)
    console.log("closed status:", codenumber)

  }, []);

  const ONE_DAY_IN_MILLISECONDS: number = 1000 * 60 * 60 * 24;
  const strDate = dayjs().format("YYYY-MM-DD");
  const differenceInMilliseconds: number = new Date(currentEstimates ? currentEstimates.history.twelveMonths.date : "").getTime() - new Date(strDate).getTime();
  const differenceInDays: number = Math.floor(differenceInMilliseconds / ONE_DAY_IN_MILLISECONDS);
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // useEffect(() => {
  //   try {
  //     axios.get(
  //       `${API_URL}/close-status/getOne/${codenumber}`
  //     ).then((res: any) => {
  //       console.log(res);
  //       const closeStatus = res.data.isClosed;
  //       setClosedButton(closeStatus);
  //     }).catch(err => {
  //       console.log(err);
  //     });
  //   }
  //   catch (e) {
  //     console.log(e);
  //   }
  // }, []);



  // axios.get(
  //         `${API_URL}/close-status/getOne/${codenumber}`
  //       ).then((res: any) => {
  //         console.log(res);
  //         const closeStatus = res.data.isClosed;
  //         setClosedButton(closeStatus);})

  const handleFinishCase = async () => {
    setOpen(false);
    // navigate(-1);
    const codeNumber = codenumber;
    const processor = username;
    const isClosed = "true";
    setClosedButton("true");
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
  };
  useEffect(() => {
    dispatch(closeStatusListData());
  }, []);

  // const handleSubmit = () => {
  //   const ors = orsAndSatisfactionScaleAnswers.reduce((prev, curr) => {
  //     return prev + curr;
  //   }, 0); 

  //   axios.post(
  //     `${API_URL}/score/create`,
  //     {
  //       ...scoreEntity,
  //       ors: +ors || 0,
  //       score15Answers,
  //       orsAndSatisfactionScaleAnswers,
  //       date: dayjs().format("YYYY-MM-DD")
  //     },
  //   ).then(res => {
  //     console.log(res); 
  //     setSubmitted(true);
  //   }).catch(err => {
  //     console.log(err);
  //     setHasError(true);
  //   });
  // };

  // const closeStatus = currentEstimates.closeStatus;
  // console.log("closeStatus:", closeStatus);
  return (
    <DashboardLayout >
      <Box sx={{ width: '100%' }}>
        <Grid container spacing={3}>
          <Grid item md={12}>
            <Card sx={{ width: "70%", margin: "auto", marginTop: 3, borderRadius: "20px", padding: "8px" }}>
              <CardContent>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <StatusChip
                    circlePosition="right"
                    status={currentEstimates ? currentEstimates.status : SurveyStatus.Clear}
                    variant="medium"
                    content={<Typography fontWeight="600">{makeCodeNumber}</Typography>}
                  />

                  <Stack alignItems="center">
                    <Link to={backgroundSurveyPath(codenumber)} style={{ textDecoration: "none" }}>
                      <Stack direction="row" justifyContent="center" alignItems="center" gap={1}>
                        <OpenInNewIcon sx={{ color: "success.main" }} />
                        <Typography color="success.main">{t("Estimates.BackgroundSimpleInformation")}</Typography>
                      </Stack>
                    </Link>

                    <Typography>{t("Estimates.ResponsiveProcessor")}: <strong>{username}</strong></Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
          </Grid>

          {/* Estimates & Status Icons */}
          <Grid item md={6}>
            <Typography variant="h4" fontWeight="600" color="text.primary" align="center">{t("Word.Estimates")}</Typography>
          </Grid>
          <Grid item md={6}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography fontWeight="600" color="success.main">Status:</Typography>
              <StatusChip
                circlePosition="left"
                status={SurveyStatus.Clear}
                variant="medium"
                content={<Typography>{t("Status.Clear")}</Typography>}
              />
              <StatusChip
                circlePosition="left"
                status={SurveyStatus.Loss}
                variant="medium"
                content={<Typography>{t("Status.Loss")}</Typography>}
              />
              <StatusChip
                circlePosition="left"
                status={SurveyStatus.Coming}
                variant="medium"
                content={<Typography>{t("Status.Coming")}</Typography>}
              />
            </Stack>
          </Grid>

          {[...Array(3)].map((_occasionIt, occasionIndex) => {
            let ors = 0, score15 = 0;
            if (scores) {
              const filteredScores = scores.filter(s => s.occasion === (occasionIndex + 1));
              ors = Math.round(filteredScores.map(obj => obj.ors).reduce((prev, total) => total + prev, 0) / filteredScores.length);
              score15 = +(filteredScores.map(obj => obj.score15).reduce((prev, total) => total + prev, 0) / filteredScores.length).toFixed(2);
            }
            const [
              date,
              label,
              statusOfCareGiver1,
              statusOfCareGiver2,
              statusOfChild,
            ] = occasionIndex === 0 ? [
              currentEstimates ? currentEstimates.history.zeroMonth.date : strDate,
              `${t("Word.Month")} 0 -`,
              currentEstimates ? currentEstimates.history.zeroMonth.statusInDetail.careGiver1 : SurveyStatus.Loss,
              currentEstimates ? currentEstimates.history.zeroMonth.statusInDetail.careGiver2 : SurveyStatus.Loss,
              currentEstimates ? currentEstimates.history.zeroMonth.statusInDetail.child : SurveyStatus.Loss,
            ]
                : occasionIndex === 1 ? [
                  currentEstimates ? currentEstimates.history.sixMonths.date : dayjs().add(6, "month").format("YYYY-MM-DD"),
                  `${t("Word.Month")} 6 -`,
                  currentEstimates ? currentEstimates.history.sixMonths.statusInDetail.careGiver1 : SurveyStatus.Loss,
                  currentEstimates ? currentEstimates.history.sixMonths.statusInDetail.careGiver2 : SurveyStatus.Loss,
                  currentEstimates ? currentEstimates.history.sixMonths.statusInDetail.child : SurveyStatus.Loss
                ]
                  : [
                    currentEstimates ? currentEstimates.history.twelveMonths.date : dayjs().add(12, "month").format("YYYY-MM-DD"),
                    `${t("Word.Month")} 12 -`,
                    currentEstimates ? currentEstimates.history.twelveMonths.statusInDetail.careGiver1 : SurveyStatus.Loss,
                    currentEstimates ? currentEstimates.history.twelveMonths.statusInDetail.careGiver2 : SurveyStatus.Loss,
                    currentEstimates ? currentEstimates.history.twelveMonths.statusInDetail.child : SurveyStatus.Loss
                  ];

            const isScanLocked = Math.abs(dayjs().diff(date, "week")) > 0;
            const percentOrs = (ors * 100 / 15).toFixed(0);

            return (
              <>
                <Grid item md={6} key={`grid-item-${occasionIndex}`}>
                  <Card sx={{ borderRadius: "20px", padding: "8px" }}>
                    <CardHeader
                      title={
                        <Typography fontWeight="medium" align="center" sx={{ textDecoration: "underline" }}>
                          {`${t("Word.Survey")}: `}<strong>{dayjs(date).format("YYYY-MM-DD")}</strong>
                        </Typography>
                      }
                    >
                    </CardHeader>
                    <CardContent>
                      <Grid container>
                        {/* <Grid item sm={6}> */}
                        <CardContent>
                          <Grid container alignItems="center" justifyContent="center">
                            <Stack gap={2}>
                              <Stack direction="row" alignItems="center" gap={2}>
                                <Typography fontWeight="bold" variant="h4">{label}</Typography>
                                <Paper elevation={6} sx={{ borderRadius: "100%", width: "7rem", height: "7rem", padding: "3rem" }}>
                                  <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                                    <Typography color="text.secondary" fontWeight="bold" fontSize={16}>VAS</Typography>
                                    <Typography color="info.main" fontWeight="600" variant='h4'>
                                      {!ors ? (
                                        "N/A"
                                      ) : (
                                        ors <= 15 ?
                                        percentOrs + "%" : ors + "%"
                                      )}
                                    </Typography>

                                  </Stack>
                                </Paper>
                              </Stack>

                              <Stack direction="row" alignItems="center" gap={2}>
                                <Typography fontWeight="bold" variant="h4">{label}</Typography>
                                <Paper elevation={6} sx={{ borderRadius: "100%", width: "7rem", height: "7rem", padding: "1rem" }}>
                                  <Stack justifyContent="center" alignItems="center" sx={{ height: "100%" }}>
                                    <Typography color="text.secondary" fontWeight="bold" fontSize={16}>{t("Word.Score15")}</Typography>
                                    <Typography color="info.main" fontWeight="600" variant='h4'>
                                      {!ors ? (
                                        "N/A"
                                      ) : (
                                        score15
                                      )}
                                    </Typography>
                                  </Stack>
                                </Paper>
                              </Stack>
                            </Stack>
                          </Grid>
                        </CardContent>
                        {/* <Grid item sm={6}> */}
                        <CardContent>
                          <Grid container alignItems="center">
                            <Stack justifyContent="center" height="100%" gap={2} sx={{ paddingTop: "4rem" }}>
                              <Stack direction="row" alignItems="center" gap={2}>
                                <Typography fontWeight="bold">{t("Word.Guardian")} 1</Typography>
                                <StatusChip
                                  circlePosition="left"
                                  status={statusOfCareGiver1}
                                  variant="large"
                                  content={<ScanLink disabled={isScanLocked} onClick={() => handleClickScanLink(2 as PersonIndex, (occasionIndex + 1) as OccasionIndex)} />}
                                />
                              </Stack>
                              <Stack direction="row" alignItems="center" gap={2}>
                                <Typography fontWeight="bold">{t("Word.Guardian")} 2</Typography>
                                <StatusChip
                                  circlePosition="left"
                                  status={statusOfCareGiver2}
                                  variant="large"
                                  content={<ScanLink disabled={isScanLocked} onClick={() => handleClickScanLink(3 as PersonIndex, (occasionIndex + 1) as OccasionIndex)} />}
                                />
                              </Stack>
                              <Stack direction="row" alignItems="center" gap={2}>
                                <Typography fontWeight="bold">{t("Word.Child")}</Typography>
                                <StatusChip
                                  circlePosition="left"
                                  status={statusOfChild}
                                  variant="large"
                                  content={<ScanLink disabled={isScanLocked} onClick={() => handleClickScanLink(1 as PersonIndex, (occasionIndex + 1) as OccasionIndex)} />}
                                />
                              </Stack>
                            </Stack>
                          </Grid>
                        </CardContent>
                      </Grid>
                    </CardContent>
                    <CardActions sx={{ justifyContent: "flex-end" }}>
                      <ButtonPrimary onClick={() => handleClickSendSurvey(occasionIndex + 1 as OccasionIndex)}>{t("Estimates.SendSurvey")}</ButtonPrimary>
                    </CardActions>
                  </Card>
                </Grid>
              </>
            );
          })}

          {/* Mon 12 - Important events during 12 months */}
          <Grid item md={6}>
            <Card sx={{ borderRadius: "20px", padding: "8px", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
              <CardHeader
                title={
                  <Typography fontWeight="medium" align="center">
                    {`${t("Estimates.SurveyWindow")} `}<strong>{`${t("Estimates.MonthLetter")} 12 - ${t("Estimates.ImportantEventsDuring12Months")}`}</strong>
                  </Typography>
                }
                sx={{
                  textDecoration: "underline"
                }}
              >
              </CardHeader>
              <CardContent>
                <Grid container>
                  <CardContent>
                    <Grid container>
                      <Grid item md={12}>
                        <Stack direction="row" alignItems="center" gap={2}>
                          <Typography fontWeight="bold" variant="h4">{`${t("Estimates.ImpEvents")} - `}</Typography>
                          <Paper elevation={6} sx={{ borderRadius: "100%", width: "7rem", height: "7rem", padding: "2rem" }}>
                            <Stack justifyContent="center" alignItems="center" sx={{
                              height: "100%",
                              color: "text.secondary",
                              fontSize: 16
                            }}>
                              {differenceInDays >= 61 ?
                                (
                                  <Typography fontWeight="bold">{t("Estimates.ReminderIfTwoMonths")}</Typography>
                                ) : (
                                  differenceInDays >= 0 ? (
                                    <Typography fontWeight="bold">{t("Estimates.ComingSoon")}</Typography>
                                  ) : (
                                    <Typography fontWeight="bold">{t("Estimates.Missed")}</Typography>
                                  )
                                )}
                            </Stack>
                          </Paper>
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                  <CardContent>
                    <Grid container>
                      <Grid item md={12}>
                        <Stack direction="row" alignItems="center" gap={2} height="100%" sx={{ position: "relative", top: "2rem" }}>
                          <Typography fontWeight="bold">{t("Word.Guardian")} 1</Typography>
                          <StatusChip
                            circlePosition="left"
                            status={SurveyStatus.Loss}
                            variant="large"
                            content={<ScanLink disabled={false} onClick={() => handleClickImportantEventsScanLink()} />}
                          />
                        </Stack>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Grid>
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-end" }}>
                {/* <ButtonPrimary onClick={() => {
                  handleClickSendSurvey(0);
                }}>{t("Estimates.SendSurvey")}</ButtonPrimary> */}
              </CardActions>
            </Card>
          </Grid>

          {/* Follow Up Survey */}
          <Grid item md={6} my={4}>
            <Stack>
              <Link to={followUpSurveyPath(codenumber)} style={{ textDecoration: "none" }}>
                <Stack direction="row" alignItems="center" gap={1}>
                  <OpenInNewIcon sx={{ color: "success.main" }} />
                  <Typography color="success.main">{t("Estimates.FollowUpSurvey(TheProcessor)")}</Typography>
                </Stack>
              </Link>

              <Typography color="text.primary" fontWeight="bold" variant="h4">{t("Estimates.2weeks12months")}</Typography>
            </Stack>
          </Grid>
          <Grid item md={6} my={4}>
            <Stack direction="row" alignItems="center" gap={2}>
              <Typography fontWeight="600" color="success.main" variant='h4'>Status:</Typography>
              <Typography fontWeight="bold">{t(completedFollowUpSurvey ? "Estimates.FollowSurveyDone" : "Estimates.FollowUpSurveyNotDone")}</Typography>
              {/* {closedButton === "false"
                ? (!completedFollowUpSurvey
                  ? (
                    <ButtonRed disabled={completedFollowUpSurvey} sx={{ color: "#FFF" }}>
                      {t("Estimates.CloseCase")}
                    </ButtonRed>
                  ) : (
                    <ButtonRed onClick={handleClickOpen} sx={{ color: "#FFF" }}>
                      {t("Estimates.CloseCase")}
                    </ButtonRed>
                  )
                ) : (!completedFollowUpSurvey
                  ? (
                    <ButtonRed disabled={completedFollowUpSurvey} sx={{ color: "#FFF" }}>
                      {t("Estimates.InCompleted")}
                    </ButtonRed>
                  ) : (
                    <ButtonRed disabled={completedFollowUpSurvey} sx={{ color: "#FFF" }}>
                      {t("Estimates.Closed")}
                    </ButtonRed>
                  )
                )} */}
              {
                completedFollowUpSurvey ? (
                  closedButton !== "true" ? (
                    <ButtonRed onClick={handleClickOpen} sx={{ color: "#FFF" }}>
                      {t("Estimates.CloseCase")}
                    </ButtonRed>
                  ) : (
                    <ButtonRed disabled={true} sx={{ color: "#FFF" }}>
                      {t("Estimates.Closed")}
                    </ButtonRed>
                  )
                ) : (
                  // closedButton !== "true" ? (
                  //   <ButtonRed onClick={handleClickOpen} sx={{ color: "#FFF" }}>
                  //     {t("Estimates.CloseCase")}
                  //   </ButtonRed>
                  // ) : (
                  <ButtonRed disabled={completedFollowUpSurvey} sx={{ color: "#FFF" }}>
                    {t("Estimates.InCompleted")}
                  </ButtonRed>
                  // )
                )
              }
            </Stack>
          </Grid>
        </Grid>
      </Box>
      <QRCodeModal
        open={showQRCodeModal}
        onClose={() => setShowQRCodeModal(false)}
        domain={qrcodeUriDomain}
        uri={targetURI}
      />
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {t("Estimate.ConfirmSentences")}
        </DialogTitle>
        {/* <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {t("Estimate.DescribeSentences")}
          </DialogContentText>
        </DialogContent> */}
        <DialogActions>
          <Button onClick={handleFinishCase}>{t("Estimate.GotIt")}</Button>
          <Button onClick={handleClose}>{t("Estimate.Cancel")}</Button>
        </DialogActions>
      </Dialog>
    </DashboardLayout>
  );
}