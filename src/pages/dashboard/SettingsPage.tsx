import AutoAwesomeMotionIcon from '@mui/icons-material/AutoAwesomeMotion';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import MarkunreadIcon from '@mui/icons-material/Markunread';
import PersonIcon from '@mui/icons-material/Person';
import PhoneIcon from '@mui/icons-material/Phone';
import PhoneAndroidIcon from '@mui/icons-material/PhoneAndroid';
import WorkIcon from '@mui/icons-material/Work';
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Divider from '@mui/material/Divider';
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import { NavLink } from 'react-router-dom';
import eagle from "../../assets/eagle.png";
import { ButtonEdit, ButtonRedirect } from '../../core/components/button/Button';
import { useAppSelector } from "../../core/hooks/rtkHooks";
import DashboardLayout from "../../core/layout/DashboardLayout";
// import { OccasionIndex } from '../../core/model/estimates.model';
import { adminPath, homePath } from '../../core/util/pathBuilder.util';
import axios from 'axios';
import { API_URL } from '../../core/constants/base.const';
import { createClient } from '@supabase/supabase-js';
import Input from '@mui/material/Input';
import EditModal from '../../core/components/modal/EditModal';
import EditSelf from '../../core/components/modal/EditSelf';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { TextField } from '@mui/material';

enum Filters {
  Filter1,
  Filter2
}
export interface ScoreDto {
  id: number;
  occasion: number;
  score: number;
}

export default function SettingsPage() {
  const supabaseUrl = 'https://lxstflrwscwaenzwsiwv.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4c3RmbHJ3c2N3YWVuendzaXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTExMzk4NzYsImV4cCI6MjAwNjcxNTg3Nn0.ieQl89Swq9w-VJ6gOYtXG2sjEyhXlImJprtHhJWjxMU';
  const supabaseClient = createClient(supabaseUrl, supabaseKey);
  const { username, email } = useAppSelector(state => state.user);
  const [name, setName] = useState('');
  const [role, setRole] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    supabaseClient
      .from('vallentuna_users')
      .select('name, role, title, department, address, phone, email, password')
      .eq('email', email)
      .then(({ data: user, error }) => {
        if (error) {
          console.error(error);
        } else if (user.length > 0) {
          console.log('User:', user[0]);
          setName(user[0].name);
          setRole(user[0].role);
          // setEmail(user[0].email);
          setTitle(user[0].title);
          setAddress(user[0].address);
          setDepartment(user[0].department);
          setPhone(user[0].phone);
          setPassword(user[0].password);
        } else {
          console.error('User not found');
        }
      });
  }, [email]);

  const { t } = useTranslation();
  const [scoreCount_, setScoreCount_] = useState(null);
  const [scoreCount_1, setScoreCount_1] = useState(null);
  const [scoreCount_2, setScoreCount_2] = useState(null);
  const [scoreCount, setScoreCount] = useState(null);
  const [scoreCount1, setScoreCount1] = useState(null);
  const [scoreCount2, setScoreCount2] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const url_ = `${API_URL}/score/getByOccasion/1`;
  const url_1 = `${API_URL}/score/getByOccasion/2`;
  const url_2 = `${API_URL}/score/getByOccasion/3`;

  const url = `${API_URL}/adult-score/getByOccasion/1`;
  const url1 = `${API_URL}/adult-score/getByOccasion/2`;
  const url2 = `${API_URL}/adult-score/getByOccasion/3`;

  useEffect(() => {
    axios.get(url_)
      .then(response => {
        const count = response.data;
        console.log(`Number of scores with occasion 1: ${count}`);
        setScoreCount_(count);
      })
      .catch(error => {
        console.error(error); // handle the error
      });
  }, []);


  useEffect(() => {
    axios.get(url_1)
      .then(response => {
        const count = response.data;
        console.log(`Number of scores with occasion 1: ${count}`);
        setScoreCount_1(count);
      })
      .catch(error => {
        console.error(error); // handle the error
      });
  }, []);


  useEffect(() => {
    axios.get(url_2)
      .then(response => {
        const count = response.data;
        console.log(`Number of scores with occasion 1: ${count}`);
        setScoreCount_2(count);
      })
      .catch(error => {
        console.error(error); // handle the error
      });
  }, []);

  useEffect(() => {
    axios.get(url)
      .then(response => {
        const count = response.data;
        console.log(`Number of scores with occasion 1: ${count}`);
        setScoreCount(count);
      })
      .catch(error => {
        console.error(error); // handle the error
      });
  }, []);


  useEffect(() => {
    axios.get(url1)
      .then(response => {
        const count = response.data;
        console.log(`Number of scores with occasion 1: ${count}`);
        setScoreCount1(count);
      })
      .catch(error => {
        console.error(error); // handle the error
      });
  }, []);


  useEffect(() => {
    axios.get(url2)
      .then(response => {
        const count = response.data;
        console.log(`Number of scores with occasion 1: ${count}`);
        setScoreCount2(count);
      })
      .catch(error => {
        console.error(error); // handle the error
      });
  }, []);
  // occasion filter
  // const [occasionsOfSelections, setOccasionsOfSelections] = useState<{
  //   [Filters.Filter1]: Array<OccasionIndex>,
  //   [Filters.Filter2]: Array<OccasionIndex>;
  // }>({
  //   [Filters.Filter1]: [1, 2, 3],
  //   [Filters.Filter2]: [1, 2, 3]
  // });

  const handleEditClick = async (currenEmail: string) => {
    setShowEditModal(true);
    setCurrentUserId(currenEmail);
  };

  return (
    <DashboardLayout>
      {role && (
        <NavLink to={adminPath()} >
          <ToggleOnIcon />{t("AdminPage.GoToAdminPage", { ns: "AdminPage" })}asdfsadfsdsd
        </NavLink>
      )}

      {scoreCount !== null ? (
        <Box sx={{ width: '100%', paddingTop: " 100px" }}>

          <Grid container spacing={3}>

            <Grid item md={6} >
              <Card sx={{ borderRadius: "20px", padding: "8px" }}>
                <CardContent>
                  <Stack>
                    <Stack direction="row" sx={{ justifyContent: "space-between" }} alignItems="center">
                      <Stack direction="row" gap={2} alignItems="center">
                        <PersonIcon sx={{ color: "#839BAA" }} />
                        <Typography fontWeight="medium" variant="h5" sx={{ lineHeight: 2 }}>{t("Word.Name")}:</Typography>
                        <Typography>{username}</Typography>
                      </Stack>
                      <Stack>
                        <ButtonEdit onClick={() => handleEditClick(email)}>{t("AdminPage.Edit", { ns: "AdminPage" })}</ButtonEdit>
                      </Stack>
                    </Stack>
                    <Stack direction="row" gap={2} alignItems="center">
                      <WorkIcon sx={{ color: "#839BAA" }} />
                      <Typography fontWeight="medium" variant="h5" sx={{ lineHeight: 2 }}>{t("Word.Title")}:</Typography>
                      <Typography >{title}</Typography>
                    </Stack>
                    <Stack direction="row" gap={2} alignItems="center">
                      <AutoAwesomeMotionIcon sx={{ color: "#839BAA" }} />
                      <Typography fontWeight="medium" variant="h5" sx={{ lineHeight: 2 }}>{t("Word.Department")}:</Typography>
                      <Typography>{department}</Typography>
                    </Stack>
                  </Stack>

                  <Stack direction="row" gap={2} alignItems="center">
                    <PhoneAndroidIcon sx={{ color: "#839BAA" }} />
                    <Typography fontWeight="medium" variant="h5" sx={{ lineHeight: 2 }}>{t("Word.Telephone")}:</Typography>
                    <Typography>{phone}</Typography>
                  </Stack>

                  <Divider variant="middle" sx={{ width: "100%" }} />

                  <Stack direction="row" gap={2} alignItems="center">
                    <MarkunreadIcon sx={{ color: "#839BAA" }} />
                    <Stack>
                      <Typography fontWeight="medium" variant="h5" sx={{ lineHeight: 2 }}>{t("Word.Mail")}:</Typography>
                      <Typography>{email}</Typography>
                    </Stack>
                  </Stack>
                  <Divider variant="middle" sx={{ width: "100%" }} />
                  <Stack direction="row" gap={2} alignItems="center">
                    <LocationOnIcon sx={{ color: "#839BAA" }} />
                    <Stack>
                      <Typography fontWeight="medium" variant="h5">{t("Word.Address")}:</Typography>
                      <Typography>{address}</Typography>
                    </Stack>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={6} >
              <Card sx={{ borderRadius: "20px", padding: "0px", marginBottom: "0px" }}>
                <CardHeader
                  title={
                    <Typography fontWeight="medium" align="center" variant="h5" sx={{ lineHeight: 2 }}>
                      <strong>{t("Word.Surveys this Mon")}</strong>
                    </Typography>
                  }
                >
                </CardHeader>
                <Divider variant="middle" sx={{ width: "100%" }} />
                <CardContent sx={{ marginBottom: "0px" }}>
                  <Grid container>
                    <Grid item md={12}>
                      <Stack direction="row" alignItems="center" sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography sx={{ textAlign: "center", lineHeight: 1.5 }} fontWeight="700" variant="h3" color="#839BAA">Mon 0:</Typography>
                        <Typography sx={{ textAlign: "center", backgroundColor: "#006D56", borderRadius: "20px", width: "100px" }} fontWeight="medium" variant="h5"  > {scoreCount_}|{scoreCount} </Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography sx={{ textAlign: "center", lineHeight: 1.5 }} fontWeight="700" variant="h3" color="#334957" >Mon 6:</Typography>
                        <Typography sx={{ textAlign: "center", backgroundColor: "#7BC29A", borderRadius: "20px", width: "100px" }} fontWeight="medium" variant="h5"  >{scoreCount_1}|{scoreCount1}</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" sx={{ display: "flex", justifyContent: "space-between" }}>
                        <Typography sx={{ textAlign: "center", lineHeight: 1.5 }} fontWeight="700" variant="h3" color="#004E7E" >Mon 12:</Typography>
                        <Typography sx={{ textAlign: "center", backgroundColor: "#55B26C", borderRadius: "20px", width: "100px" }} fontWeight="medium" variant="h5"  >{scoreCount_2}|{scoreCount2}</Typography>
                      </Stack>

                      <NavLink to={homePath()} className={({ isActive }) => isActive ? "active" : ""}>
                        <ButtonRedirect className=" justify-center">
                          <Typography fontWeight="600">{t("SideMenu.CaseList")}</Typography>
                        </ButtonRedirect>
                      </NavLink>

                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={6} >
              <Card sx={{ borderRadius: "20px", padding: "8px" }}>
                <CardContent>
                  <Grid container>
                    <Grid item md={12}>
                      <Typography fontWeight="medium" variant="subtitle1" sx={{ lineHeight: 2, color: "#839BAA" }} >{t("Word.User Name")}</Typography>
                      <Typography fontWeight="medium" variant="h5" sx={{ lineHeight: 1.5 }}>{username}</Typography>
                      <Divider variant="middle" sx={{ width: "100%" }} />
                      <Typography fontWeight="medium" variant="subtitle1" sx={{ lineHeight: 1.5, color: "#839BAA" }}>{t("Word.Password")}</Typography>
                      <Stack direction="row" sx={{ justifyContent: "space-between" }}>
                        {!showPassword ? (
                          <Typography fontWeight="medium" variant="h5" sx={{ lineHeight: 1.5 }}>
                            ********************
                          </Typography>
                        ) : (
                          <Typography fontWeight="medium" variant="h5" sx={{ lineHeight: 1.5 }}>
                            {password}
                          </Typography>
                        )}
                        <VisibilityIcon onClick={() => setShowPassword(!showPassword)} />
                      </Stack>
                      {/* {!showPassword ? (
                        <Typography fontWeight="medium" variant="h5" sx={{ lineHeight: 1.5 }}>
                          ********************
                            <VisibilityIcon onClick={() => setShowPassword(true)}/>
                        </Typography>
                      ) : (
                        <Typography fontWeight="medium" variant="h5" sx={{ lineHeight: 1.5 }}>
                          {password}
                            <VisibilityIcon onClick={() => setShowPassword(false)}/>
                        </Typography>
                      )} */}

                      <Divider variant="middle" sx={{ width: "100%" }} />
                      {/* <TextField  variant="standard"></TextField>
                    <TextField  variant="standard"></TextField> */}
                    </Grid>
                  </Grid>
                  <NavLink to="mailto://info@vallentuna.se"  >
                    <Typography fontWeight="small" variant="subtitle1" sx={{ textAlign: "right" }}>
                      Kontakta Support
                    </Typography>
                  </NavLink>
                </CardContent>
              </Card>
            </Grid>
            <Grid item md={6} >
              <Card sx={{ borderRadius: "20px", padding: "8px" }}>
                <CardContent>
                  {/* <Grid container>
                  <Grid item md={2}>
                    <img src={eagle}></img>
                  </Grid>
                  <Grid item md={10}>
                    <Typography fontWeight="medium" variant="h5" sx={{ lineHeight: 2 }}><MarkunreadIcon />Info@vallentuna.se</Typography>
                    <Typography fontWeight="medium" variant="h5" sx={{ lineHeight: 2 }}><PhoneIcon />070-123 45 67</Typography>
                  </Grid>
                </Grid> */}
                  <Stack direction="row" gap={2} alignItems="center">
                    <Stack>
                      <img src={eagle}></img>
                    </Stack>
                    <Stack>
                      <Stack direction="row" alignItems="center" >
                        <MarkunreadIcon /><Typography fontWeight="medium" variant="h5" sx={{ lineHeight: 2 }}>Info@vallentuna.se</Typography>
                      </Stack>
                      <Stack direction="row" alignItems="center" >
                        <PhoneIcon /><Typography fontWeight="medium" variant="h5" sx={{ lineHeight: 2 }}>070-123 45 67</Typography>
                      </Stack>
                    </Stack>
                  </Stack>
                  <Grid item md={12}>
                    <Typography fontWeight="medium" variant="h5" sx={{ textAlign: "center", lineHeight: 2 }}>Fabriksvägen 5b,Vallentuna</Typography>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Box>
      ) : (
        <p>Loading...</p>
      )}
      <EditSelf
        open={showEditModal}
        currentEmail={email}
        onClose={() => setShowEditModal(false)}
      />
    </DashboardLayout>


  );
}