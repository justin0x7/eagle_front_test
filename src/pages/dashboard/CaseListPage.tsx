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
import { EstimatesDto } from "../../core/model/estimates.model";
import { SurveyStatus } from '../../core/model/status.model';
import { setCurrentEstimatesAction } from '../../core/store/slices/backgroundSurveySlice';
import { loadCaseListData } from "../../core/store/slices/caseListSlice";
import { closeStatusListData } from "../../core/store/slices/closeStatusSlice";
import { adultCaseList, adultSystematicFollowUpPath, estimatesPath } from '../../core/util/pathBuilder.util';
import HistorySummary from './resources/HistorySummary';
import StyledTab from './resources/StyledTab';
import StyledTabs from './resources/StyledTabs';
import TabPanel from './resources/TabPanel';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import axios from 'axios';
import { API_URL } from '../../core/constants/base.const';
import { createClient } from '@supabase/supabase-js';

export default function CaseListPage() {
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
          console.error(error);
        } else if (user.length > 0) {
          console.log('User:', user[0]);
          setRole(user[0].role);
          // setEmail(user[0].email);
        } else {
          console.error('User not found');
        }
      });
  }, [email]);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const { caseList } = useAppSelector(state => state.caseListSurvey);
  const { closeStatusList } = useAppSelector(state => state.closeStatusIn);
  const { username } = useAppSelector(state => state.user);
  // console.log("closeStatusList:", closeStatusList)

  const [searchString, setSearchString] = useState("");
  const [activeTabIndex, setActiveTabIndex] = useState(0);
  // const [showLinkModal, setShowLinkModal] = useState(false);
  // const [selectedRow, setSelectedRow] = useState<EstimatesDto>();
  // const tabList = ["All", "Loss", "Clear", "Coming"]

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
      // renderCell: (data) => {
      //   const [rowCodeNumber, setRowCodeNumber] = useState("");

      //   useEffect(() => {
      //     try {
      //       axios.get(
      //         `${API_URL}/close-status/getOne/${username}`
      //       ).then((res: any) => {
      //         console.log(res);
      //         setRowCodeNumber(res.data.codeNumber);
      //       }).catch(err => {
      //         console.log(err);
      //       });
      //     }
      //     catch (e) {
      //       console.log(e);
      //     }
      //   }, []);
      //   return (
      //     rowCodeNumber
      //   )
      // }
    },
    {
      field: 'status',
      headerName: t("CaseList.TableHeader.Status").toString(),
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 300,
      // renderCell: () => <TodoIconImage />
      // renderCell: (data) => {data.row.nextsurvey ? (<LossIconImage />) : (<LossIconImage />)} 
      // renderCell: () => <DoneIconImage />
      renderCell: (data) => {
        return (data.row.status === "Coming" ? (
          <LossIconImage />
        ) : (
          data.row.status === "Loss" ?
            (
              <TodoIconImage />
            ) : (
              // <DoneIconImage />
              <TodoIconImage />
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
    //   renderCell: () => <ToDoList />
    // },
    {
      field: 'history',
      headerName: t("CaseList.TableHeader.SurveyStatus").toString(),
      headerAlign: "left",
      align: "left",
      sortable: false,
      width: 400,
      renderCell: (props: GridRenderCellParams<any, any, any, GridTreeNodeWithRender>) => <HistorySummary data={props.value} />
    },
    {
      field: 'nextSurvey',
      headerName: t("CaseList.TableHeader.NextSurvey").toString(),
      headerAlign: "left",
      align: "left",
      width: 400,
      renderCell: (data) => {
        // console.log(data.row.signal);
        const checked = closeStatusList.find((tip) => tip.codeNumber === data.row.codeNumber)?.isClosed
        console.log("CONSOLE:", checked)
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

        const closeStatusFilteredData = closeStatusList.find((tip) => tip.codeNumber === data.row.codeNumber)
        const output = closeStatusFilteredData?.processor
        useEffect(() => {
          setRowProcessor(output);
        }, []);

        // console.log("XXXXXXXXX:", closeStatusFilteredData)
        // console.log("codeNumber:", data.row.codeNumber)
        return (
          rowProcessor
        )
      }
    },
  ]), [t]);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setActiveTabIndex(newValue);
  };

  const handleRowClick = (e: GridRowParams<EstimatesDto>) => {
    // setShowLinkModal(true);
    // setSelectedRow(e.row);

    dispatch(setCurrentEstimatesAction(e.row));
    navigate(estimatesPath(e.row.codeNumber));
  };

  // const filteredRows = caseList.length ? caseList.filter(row => row.codeNumber.includes(searchString))
  //   : [];  
  const caseListFilter = closeStatusList.filter((tip) => tip.processor === username).map(row => {
    return caseList.find(item => item.codeNumber === row.codeNumber);
  })
  const filteredRows = role ? (
    caseList ? (activeTabIndex === 0 ? caseList
      : caseList.filter(row => row.status === (
        activeTabIndex === 1 ? SurveyStatus.Loss
          : activeTabIndex === 2 ? SurveyStatus.Clear
            : SurveyStatus.Coming)
      )).filter(row => row.codeNumber.includes(searchString))
      : []
  ) : (
    caseListFilter
      ? (activeTabIndex === 0 ? caseListFilter
        : caseListFilter.filter((row: any) => row?.status === (
          activeTabIndex === 1 ? SurveyStatus.Loss
            : activeTabIndex === 2 ? SurveyStatus.Clear
              : SurveyStatus.Coming)
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
  
  // console.log("activeTabIndex:", activeTabIndex, "filteredRows:", filteredRows)

  // const switchProcessor = (closeStatusList.find(item => item.processor === username))?.codeNumber

  // console.log("role:", role)
  // const filterByProcessor = role 
  // ? (filteredRows.length ? filteredRows : []) : (
  //   filteredRows.length 
  //   ? closeStatusList.filter((tip) => tip.processor === username).map(row => {
  //   return filteredRows.find(item => item.codeNumber === row.codeNumber);
  // }) : [])
  // console.log("filterResult:", filterByProcessor)

  useEffect(() => {
    dispatch(loadCaseListData());
    dispatch(closeStatusListData());
  }, []);

  // const [rowCodeNumber, setRowCodeNumber] = useState("");

  //   useEffect(() => {
  //     try {
  //       axios.get(
  //         `${API_URL}/close-status/getOne/${username}`
  //       ).then((res: any) => {
  //         console.log(res);
  //         setRowCodeNumber(res.data.codeNumber);
  //       }).catch(err => {
  //         console.log(err);
  //       });
  //     }
  //     catch (e) {
  //       console.log(e);
  //     }
  //   }, [rowCodeNumber]);

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
            <NavLink to={adultCaseList()} className={({ isActive }) => isActive ? "active" : ""}>
              <ToggleOnIcon />
            </NavLink>
            <Typography fontSize={10}>{t("Case.Adult")}</Typography>
          </Stack>
          <Stack>
            <Typography fontSize={30}>{t("System.ChildTopic")}</Typography>
          </Stack>
        </Stack>

        <Card>
          <CardContent sx={{ padding: 0 }}>
            <Box>
              {role ? (
                <StyledTabs value={activeTabIndex} onChange={handleTabChange} aria-label="basic tabs example">
                  <StyledTab
                    icon={(caseList?.length || 0).toString()}
                    label={t("CaseList.AllCodeNumber")}
                  />
                  <StyledTab
                    icon={(caseList?.filter(data => data.status === SurveyStatus.Loss).length || 0).toString()}
                    label={t("CaseList.FullyAnswered")}
                  />
                  <StyledTab
                    icon={(caseList?.filter(data => data.status === SurveyStatus.Clear).length || 0).toString()}
                    label={t("CaseList.Ongoing")}
                  />
                  <StyledTab
                    icon={(caseList?.filter(data => data.status === SurveyStatus.Coming).length || 0).toString()}
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
                    icon={(caseListFilter?.filter(data => data?.status === SurveyStatus.Loss).length || 0).toString()}
                    label={t("CaseList.FullyAnswered")}
                  />
                  <StyledTab
                    icon={(caseListFilter?.filter(data => data?.status === SurveyStatus.Clear).length || 0).toString()}
                    label={t("CaseList.Ongoing")}
                  />
                  <StyledTab
                    icon={(caseListFilter?.filter(data => data?.status === SurveyStatus.Coming).length || 0).toString()}
                    label={t("CaseList.ActionRequired")}
                  />
                </StyledTabs>
              )}
            </Box>
            <TabPanel>
              <Box className="w-full">
                <DataGridPro
                  // rows={filterByProcessor.filter(item=> activeTabIndex == 0 ? true : item?.status == tabList[activeTabIndex])}
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