import SearchIcon from '@mui/icons-material/Search';
import { Box, InputAdornment, Stack, TextField, Typography } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { DataGrid, GridColDef, GridRenderCellParams, GridRowParams, GridTreeNodeWithRender } from '@mui/x-data-grid';
import { DataGridPro } from "@mui/x-data-grid-pro"
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { NavLink, useNavigate } from "react-router-dom";

import { ComingIconImage, DoneIconImage, LossIconImage, TodoIconImage } from "../../assets/AppImages";
import { useAppDispatch, useAppSelector } from "../../core/hooks/rtkHooks";
import DashboardLayout from "../../core/layout/DashboardLayout";
import { AdultEstimatesDto } from "../../core/model/adultEstimates.model";
import { SurveyStatus } from '../../core/model/status.model';
import { setCurrentEstimatesAction } from '../../core/store/slices/backgroundAdultSurveySlice';
import { loadCaseListAdultData } from "../../core/store/slices/caseListAdultSlice";
import { closeStatusAdultListData } from "../../core/store/slices/closeStatusAdultSlice";
import { estimatesAdultPath, caseListPath } from '../../core/util/pathBuilder.util';
import AdultHistorySummary from './resources/AdultHistorySummary';
import StyledTab from './resources/StyledTab';
import StyledTabs from './resources/StyledTabs';
import TabPanel from './resources/TabPanel';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import axios from 'axios';
import { API_URL } from '../../core/constants/base.const';
import { createClient } from '@supabase/supabase-js';
import { type } from 'os';

export default function CaseListAdultPage() {
  const supabaseUrl = 'https://lxstflrwscwaenzwsiwv.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4c3RmbHJ3c2N3YWVuendzaXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTExMzk4NzYsImV4cCI6MjAwNjcxNTg3Nn0.ieQl89Swq9w-VJ6gOYtXG2sjEyhXlImJprtHhJWjxMU';
  const supabaseClient = createClient(supabaseUrl, supabaseKey);
  const { email } = useAppSelector(state => state.user);
  const [name, setName] = useState('');
  const [role, setRole] = useState(false);

  React.useEffect(() => {
    supabaseClient
      .from('vallentuna_users')
      .select('name, role, title, department, address, phone, email')
      .eq('email', email)
      .then(({ data: user, error }) => {
        if (error) {
          // console.error(error);
        } else if (user.length > 0) {
          // console.log('User:', user[0]);
          setRole(user[0].role);
          // setEmail(user[0].email);
        } else {
          // console.error('User not found');
        }
      });
  }, [email]);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { caseList } = useAppSelector(state => state.caseListAdultSurvey);
  const { closeStatusAdultList } = useAppSelector(state => state.closeStatusAdultIn);
  console.log("closeStatusAdult", closeStatusAdultList)
  const { username } = useAppSelector(state => state.user);
  const [searchString, setSearchString] = useState("");
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  // const [showLinkModal, setShowLinkModal] = useState(false);
  // const [selectedRow, setSelectedRow] = useState<EstimatesDto>();

  const columns: GridColDef[] = useMemo(() => ([
    // { field: 'id', type: 'number', sortable: false, width: 30 },
    {
      field: 'codeNumberForSort',
      headerName: t("CaseList.TableHeader.CodeNumber").toString(),
      headerAlign: "left",
      align: "left",
      type: 'number',
      sortable: true,
      width: 300,
      renderCell: (data) => {
        return <p>{data.row.codeNumber}</p>
      }
    },
    {
      field: 'status',
      headerName: t("CaseList.TableHeader.Status").toString(),
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 300,
      // renderCell: () => <TodoIconImage />
      // renderCell: () => <LossIconImage />
      // renderCell: () => <DoneIconImage />
      renderCell: (data) => {
        return (data.row.status === "Loss" ? (
          <LossIconImage />
        ) : (
          data.row.status === "Coming" ? (
            <TodoIconImage />
          ) : (
            <DoneIconImage />
          )
        ))
      }
    },
    // {
    //   field: 'missedFields',
    //   headerName: t("CaseList.TableHeader.Todo").toString(),
    //   headerAlign: "left",
    //   align: "left",
    //   sortable: false,
    //   width: 300,
    // },
    {
      field: 'history',
      headerName: t("CaseList.TableHeader.SurveyStatus").toString(),
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 400,
      renderCell: (props: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => <AdultHistorySummary data={props.value} />
    },
    {
      field: 'nextSurvey',
      headerName: t("CaseList.TableHeader.NextSurvey").toString(),
      headerAlign: "left",
      align: "left",
      width: 400,
      renderCell: (data) => {
        // console.log(data.row.signal);
        const checked = closeStatusAdultList.find((tip) => tip.codeNumber === data.row.codeNumber)?.isClosed
        console.log("AAAAAAAAAAAAAAAAAAA:", checked)
        return (
          checked !== "true" || null ? (
          data.row.nextSurvey + t(data.row.signal)
          ) : (
            t("CaseList.Next.Closed")
          )
        )
      }
    },
    {
      field: 'processor',
      headerName: t("CaseList.TableHeader.Processor").toString(),
      headerAlign: "left",
      align: "left",
      width: 200,
      renderCell: (data) => {
        const [rowProcessor, setRowProcessor] = useState<undefined | string>("");

        const closeStatusFilteredData = closeStatusAdultList.find((tip) => tip.codeNumber === data.row.codeNumber)
        const output = closeStatusFilteredData?.processor
        useEffect(() => {
          setRowProcessor(output);
        }, []);

        // console.log("XXXXXXXXX:", closeStatusFilteredData)
        // console.log("output:", closeStatusAdultList)
        return (
          rowProcessor
        )
      }
    },
    // {
    //   field: 'processor',
    //   headerName: t("CaseList.TableHeader.Processor").toString(),
    //   headerAlign: "left",
    //   align: "left",
    //   width: 200,
    //   renderCell: (data) => {
    //     const [rowProcessor, setRowProcessor] = useState("");

    //     useEffect(() => {
    //       try {
    //         axios.get(
    //           `${API_URL}/close-status-adult/getOne/${data.row.codeNumber}`
    //         ).then((res: any) => {
    //           console.log(res);
    //           setRowProcessor(res.data.processor);
    //         }).catch(err => {
    //           console.log(err);
    //         });
    //       }
    //       catch (e) {
    //         console.log(e);
    //       }
    //     }, []);
    //     return (
    //       rowProcessor
    //     )
    //   }
    // },
  ]), [t]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue);
  };

  const handleRowClick = (e: GridRowParams<AdultEstimatesDto>) => {
    // setShowLinkModal(true);
    // setSelectedRow(e.row);

    dispatch(setCurrentEstimatesAction(e.row));
    navigate(estimatesAdultPath(e.row.codeNumber));
  };

  // const filteredRows = caseList ? (activeTabIndex === 0 ? caseList
  //   : caseList.filter(row => row.status === (
  //     activeTabIndex === 1 ? SurveyStatus.Clear
  //       : activeTabIndex === 2 ? SurveyStatus.Coming
  //         : SurveyStatus.Loss)
  //   )).filter(row => row.codeNumber.includes(searchString))
  //   : [];

  const caseListFilter = closeStatusAdultList.filter((tip) => tip.processor === username).map(row => {
    return caseList.find(item => item.codeNumber === row.codeNumber);
  })
  const filteredRows = role ? (
    caseList ? (activeTabIndex === 0 ? caseList
      : caseList.filter(row => row.status === (
        activeTabIndex === 1 ? SurveyStatus.Clear
          : activeTabIndex === 2 ? SurveyStatus.Coming
            : SurveyStatus.Loss)
      )).filter(row => row.codeNumber.includes(searchString))
      : []
  ) : (
    caseListFilter
      ? (activeTabIndex === 0 ? caseListFilter
        : caseListFilter.filter((row: any) => row?.status === (
          activeTabIndex === 1 ? SurveyStatus.Clear
            : activeTabIndex === 2 ? SurveyStatus.Coming
              : SurveyStatus.Loss)
        )).filter((row: any) => row?.codeNumber.includes(searchString))
      : []
  )

  const getThreeNumber = (number: string) => {
    if (number.length == 1) {
      return "00" + number
    } else if (number.length == 2) {
      return "0" + number
    } 
    return number
  }

  const rows = filteredRows.map((d: any, idx) => {
    const codeNumberForSort = d.codeNumber.slice(3, 7) + getThreeNumber(d.codeNumber.split("-")[1])
    return { ...d, codeNumberForSort: Number(codeNumberForSort), id: idx + 1}
  });
  const sorted = rows.sort((a, b) => a.codeNumberForSort - b.codeNumberForSort)

  useEffect(() => {
    dispatch(loadCaseListAdultData());
    dispatch(closeStatusAdultListData());
  }, []);

  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <TextField
              id="search-bar"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              variant="standard"
              placeholder={t("Dashboard.SearchCodeNumber").toString()}
              value={searchString}
              onChange={e => setSearchString(e.target.value)}
            />
          </CardContent>
        </Card>



        <Stack direction="row" spacing={20} paddingTop={2}>
          <Stack direction="row">
            <NavLink to={caseListPath()} className={({ isActive }) => isActive ? "active" : ""}>
              <ToggleOffIcon />
            </NavLink>
            <Typography fontSize={10}>{t("Case.Child")}</Typography>
          </Stack>
          <Stack>
            <Typography fontSize={30}>{t("System.AdultTopic")}</Typography>
          </Stack>
        </Stack>

        <Card>
          <CardContent sx={{ padding: 0 }}>
            <Box>{role ? (
                <StyledTabs value={activeTabIndex} onChange={handleTabChange} aria-label="basic tabs example">
                  <StyledTab
                    icon={(caseList?.length || 0).toString()}
                    label={t("CaseList.AllCodeNumber")}
                  />
                  <StyledTab
                    icon={(caseList?.filter(data => data.status === SurveyStatus.Clear).length || 0).toString()}
                    label={t("CaseList.FullyAnswered")}
                  />
                  <StyledTab
                    icon={(caseList?.filter(data => data.status === SurveyStatus.Coming).length || 0).toString()}
                    label={t("CaseList.Ongoing")}
                  />
                  <StyledTab
                    icon={(caseList?.filter(data => data.status === SurveyStatus.Loss).length || 0).toString()}
                    label={t("CaseList.ActionRequired")}
                  />
                </StyledTabs>
              ) : (
                <StyledTabs value={activeTabIndex} onChange={handleTabChange} aria-label="basic tabs example">
                  <StyledTab
                    icon={(caseListFilter?.length || 0).toString()}
                    label={t("CaseList.AllCodeNumber")}
                  />
                  <StyledTab
                    icon={(caseListFilter?.filter(data => data?.status === SurveyStatus.Clear).length || 0).toString()}
                    label={t("CaseList.FullyAnswered")}
                  />
                  <StyledTab
                    icon={(caseListFilter?.filter(data => data?.status === SurveyStatus.Coming).length || 0).toString()}
                    label={t("CaseList.Ongoing")}
                  />
                  <StyledTab
                    icon={(caseListFilter?.filter(data => data?.status === SurveyStatus.Loss).length || 0).toString()}
                    label={t("CaseList.ActionRequired")}
                  />
                </StyledTabs>
              )}
            </Box>
            <TabPanel>
              <Box className="w-full">
                <DataGridPro
                  rows={sorted}
                  columns={columns}
                  autoHeight={true}
                  rowSelection={false}
                  rowHeight={80}
                  checkboxSelection={false}
                  onRowClick={handleRowClick}
                  classes={{
                    columnHeaderTitle: "font-bold"
                  }}
                />
              </Box>
            </TabPanel>
          </CardContent>
        </Card>

      </Box>
    </DashboardLayout>
  );
}