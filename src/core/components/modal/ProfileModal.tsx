import CancelIcon from '@mui/icons-material/Cancel';
import { Box, Button, Dialog, DialogContent, DialogTitle, FormControl, FormControlLabel, Grid, IconButton, Input, InputLabel, MenuItem, Radio, RadioGroup, Stack, TextField, Typography } from '@mui/material';
import { createClient } from '@supabase/supabase-js';
import * as React from 'react';
import { useRef, useState } from 'react';
import { useTranslation } from "react-i18next";
import { ButtonPrimary } from '../button/Button';
import { Controller, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../hooks/rtkHooks';
import { SignUpUserProps } from '../../model/user.model';
import { signupUser, clearState } from '../../store/slices/userSlice';
import { loginPath } from '../../util/pathBuilder.util';
import InputWithIcon from '../input/InputWithIcon';
import { IdImage, SecureImage } from '../../../assets/AppImages';
import InputRegister from '../input/ImputRegister';

interface Props {
  open: boolean;
  onClose: () => void;
  // inputRefPassword: any;
}

export default function ProfileModal(props: Props) {
  const inputRef = useRef()

  const supabaseUrl = 'https://lxstflrwscwaenzwsiwv.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4c3RmbHJ3c2N3YWVuendzaXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTExMzk4NzYsImV4cCI6MjAwNjcxNTg3Nn0.ieQl89Swq9w-VJ6gOYtXG2sjEyhXlImJprtHhJWjxMU';
  const supabaseClient = createClient(supabaseUrl, supabaseKey);

  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [role, setRole] = useState(false);
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const saveProfile = async (name: string, role: boolean, title: string, department: string, address: string, phone: string, email: string, password: string) => {
    try {
      const { error } = await supabaseClient
        .from('vallentuna_users')
        .insert({
          name,
          role,
          title,
          department,
          address,
          phone,
          email,
          password
        });

      if (error) {
        console.error(error);
        return null;
      }

      return { name, role, title, department, address, phone, email, password };

    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const handleRoleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setRole(e.target.value === 'admin');
  };

  const handleSave = async () => {
    if (!name || !title || !department || !address || !phone || !email) {
      alert('All fields are required');
      return;
    }
    const savedContact = await saveProfile(name, role, title, department, address, phone, email, password);
    if (savedContact) {
      console.log('Contact saved successfully:', savedContact);
      // window.location.reload();
    } else {
      console.error('Failed to save contact');
    }
  };

  // register

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const { isSuccess, isError, errorMessage } = useAppSelector(state => state.user);
  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<SignUpUserProps>();

  const onSubmit = (data: SignUpUserProps) => {
    dispatch(signupUser(data));
  };

  React.useEffect(() => {
    return () => {
      dispatch(clearState());
    };
  }, []);

  React.useEffect(() => {
    if (isSuccess) {
      console.log("asdfasdfasdf");
      dispatch(clearState());
    }
    if (isError) {
      toast.error(errorMessage);
      dispatch(clearState());
    }
  }, [isSuccess, isError]);

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      aria-labelledby="qrcode-modal"
      aria-describedby="qrcode"
      fullWidth={true}
      maxWidth="sm"
    >
      <DialogTitle sx={{
        display: "flex",
        justifyContent: "space-between",
      }}>
        <IconButton
          aria-label='close'
          onClick={props.onClose}
        >
          <CancelIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box sx={{
          textAlign: "center"
        }}>
          <form noValidate autoComplete="on" onSubmit={handleSubmit(onSubmit)} method="POST">
            {/* <form noValidate autoComplete="off" > */}
            <Grid container padding={3}>
              <Grid item xs={12} paddingBottom={1}>
                <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                  <Typography>{t("CRUD.Name")}:</Typography>
                  {/* <TextField id="name" label="Name" value={name} onChange={(e) => setName(e.target.value)} /> */}
                  <Controller
                    control={control}
                    name="username"
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                      // <InputRegister
                      //   value={value}
                      //   onChange={onChange}
                      //   placeholder="Username"
                      //   type="text"
                      // />
                      <TextField id="name" label="Name" value={value} onChange={(e) => {
                        onChange(e)
                        setName(e.target.value)
                      }} />
                    )}
                  />
                  {errors?.username && <p>{errors.username.message}</p>}
                </Stack>
              </Grid>
              {/* <Grid item xs={12} paddingBottom={1}>
                    <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                      <Typography>Role:</Typography>
                      <TextField id="title" label="Title" value={role} onChange={(e) => setRole(role)} />
                    </Stack>
                  </Grid> */}
              <Grid item xs={12} paddingBottom={1}>
                <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                  <Typography>{t("CRUD.Title")}:</Typography>
                  <TextField id="title" label={t("CRUD.Title")} value={title} onChange={(e) => setTitle(e.target.value)} />
                </Stack>
              </Grid>
              <Grid item xs={12} paddingBottom={1}>
                <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                  <Typography>{t("CRUD.Department")}:</Typography>
                  <TextField id="department" label={t("CRUD.Department")} value={department} onChange={(e) => setDepartment(e.target.value)} />
                </Stack>
              </Grid>
              <Grid item xs={12} paddingBottom={1}>
                <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                  <Typography>{t("CRUD.Address")}:</Typography>
                  <TextField id="address" label={t("CRUD.Address")} value={address} onChange={(e) => setAddress(e.target.value)} />
                </Stack>
              </Grid>
              <Grid item xs={12} paddingBottom={1}>
                <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                  <Typography>{t("CRUD.PhoneNumber")}:</Typography>
                  <TextField id="phone" label={t("CRUD.PhoneNumber")} value={phone} onChange={(e) => setPhone(e.target.value)} />
                </Stack>
              </Grid>
              <Grid item xs={12} paddingBottom={1}>
                <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                  <Typography>{t("CRUD.Email")}:</Typography>
                  {/* <TextField id="email" label="Email" value={email} onChange={(e) => setEmail(e.target.value)} /> */}
                  <Controller
                    control={control}
                    name="email"
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                      // <InputRegister
                      //   value={value}
                      //   onChange={onChange}
                      //   placeholder="Email"
                      //   type="text"
                      // />
                      <TextField id="email" label={t("CRUD.Email")} value={value} onChange={(e) => {
                        onChange(e)
                        setEmail(e.target.value)
                      }} />
                    )}
                  />
                  {errors?.email && <p>{errors.email.message}</p>}
                </Stack>
              </Grid>

              <Grid item xs={12} paddingBottom={1}>
                <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                  <Typography>{t("CRUD.Password")}:</Typography>
                  {/* <TextField id="password" label="Password" value={password} onChange={(e) => setPassword(e.target.value)} /> */}
                  <Controller
                    control={control}
                    name="password"
                    defaultValue=""
                    render={({ field: { onChange, value } }) => (
                      // <InputRegister
                      //   value={value}
                      //   onChange={onChange}
                      //   placeholder="Password"
                      //   type="password"
                      // />
                      <TextField type='password' id="password" label={t("CRUD.Password")} value={value} onChange={(e) => {
                        onChange(e)
                        setPassword(e.target.value)
                      }} />
                    )}
                  />
                  {/* <TextField id="password" label="Password" value={password} onChange={ (e) => setPassword(e.target.value) } /> */}
                </Stack>
              </Grid>

              {/* <Controller
                control={control}
                name="username"
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <InputRegister
                    value={value}
                    onChange={onChange}
                    placeholder="Username"
                    type="text"
                  />
                )}
              />
              {errors?.username && <p>{errors.username.message}</p>} */}

              {/* <Controller
                control={control}
                name="email"
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <InputRegister
                    value={value}
                    onChange={onChange}
                    placeholder="Email"
                    type="text"
                  />
                )}
              />
              {errors?.email && <p>{errors.email.message}</p>} */}
              {/* <Controller
                control={control}
                name="password"
                defaultValue=""
                render={({ field: { onChange, value } }) => (
                  <InputRegister
                    value={value}
                    onChange={onChange}
                    placeholder="Password"
                    type="password"
                  />
                )}
              /> */}

              <Grid item xs={12} paddingBottom={1}>
                <Stack sx={{ justifyContent: "space-between", alignItems: "center" }} direction={"row"}>
                  <Typography>{t("CRUD.Role")}:</Typography>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                    value={role ? 'admin' : 'manager'}
                    onChange={handleRoleChange}
                  >
                    <FormControlLabel value="admin" control={<Radio />} label={t("CRUD.Admin")} />
                    <FormControlLabel value="manager" control={<Radio />} label={t("CRUD.Handler")} />
                  </RadioGroup>
                </Stack>
              </Grid>
            </Grid>
            <ButtonPrimary type='submit' variant="contained" color="primary" onClick={handleSave}>
              {t("CRUD.Save")}
            </ButtonPrimary>
          </form>
        </Box>
      </DialogContent>
    </Dialog >
  );
}