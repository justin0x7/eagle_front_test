import { Box, Button, Stack, Typography } from "@mui/material";
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import Paper from '@mui/material/Paper';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { createClient } from '@supabase/supabase-js';
import { ButtonDelete, ButtonEdit, ButtonPrimary } from '../../core/components/button/Button';
import EditModal from "../../core/components/modal/EditModal";
import ProfileModal from '../../core/components/modal/ProfileModal';
import DashboardLayout from "../../core/layout/DashboardLayout";
import TabPanel from './resources/TabPanel';

interface User {
  id: string;
  name: string;
  role?: boolean;
  email: string;
  title: string;
  department: string;
  phone: string;
  address: string;
}

export default function AdminPage() {
  const [users, setUsers] = useState<User[]>([]);
  const { t } = useTranslation();

  const supabaseUrl = 'https://lxstflrwscwaenzwsiwv.supabase.co';
  const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4c3RmbHJ3c2N3YWVuendzaXd2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTExMzk4NzYsImV4cCI6MjAwNjcxNTg3Nn0.ieQl89Swq9w-VJ6gOYtXG2sjEyhXlImJprtHhJWjxMU';
  const supabaseClient = createClient(supabaseUrl, supabaseKey);

  useEffect(() => {
    supabaseClient
      .from('vallentuna_users')
      .select('*')
      .then(({ data, error }) => {
        // console.log("data", data)
        if (error) {
          console.error(error);
        } else {
          setUsers(data || []);
          console.log('user data', users);

        }
      });
  }, []);

  const [showProfileModal, setShowProfileModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [currentUserId, setCurrentUserId] = useState("");

  const handleAddUserClick = () => {
    setShowProfileModal(true);
  };

  const handleDeleteClick = async (userId: string) => {
    const { error } = await supabaseClient
      .from('vallentuna_users')
      .delete()
      .eq('id', userId);

    if (error) {
      console.error(error);
    } else {
      setUsers(users.filter(user => user.id !== userId));
    }
  };

  const handleEditClick = async (userId: string) => {
    setShowEditModal(true);
    setCurrentUserId(userId);
  };
  return (
    <DashboardLayout>
      <Box sx={{ width: '100%' }}>
        <Card sx={{ mb: 2 }}>
          <CardContent>
            <Stack direction="row" sx={{ justifyContent: "space-between" }}>
              <Typography>{t("AdminPage.UsersProfileSetting", { ns: "AdminPage" })}</Typography>
              <ButtonPrimary onClick={handleAddUserClick}>{t("AdminPage.AddUser", { ns: "AdminPage" })}</ButtonPrimary>
            </Stack>
          </CardContent>
        </Card>

        <Card>
          <CardContent sx={{ padding: 0 }}>
            <TabPanel>
              <Box className="w-full">
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="simple table">
                    <TableHead>
                      <TableRow>
                        <TableCell>{t("AdminPage.Name", { ns: "AdminPage" })}</TableCell>
                        <TableCell align="center">{t("AdminPage.Role", { ns: "AdminPage" })}</TableCell>
                        <TableCell align="left">{t("AdminPage.Email", { ns: "AdminPage" })}</TableCell>
                        <TableCell align="left">{t("AdminPage.Title", { ns: "AdminPage" })}</TableCell>
                        <TableCell align="left">{t("AdminPage.Department", { ns: "AdminPage" })}</TableCell>
                        <TableCell align="left">{t("AdminPage.Phone", { ns: "AdminPage" })}</TableCell>
                        <TableCell align="left">{t("AdminPage.Address", { ns: "AdminPage" })}</TableCell>
                        <TableCell align="center">{t("AdminPage.Edit", { ns: "AdminPage" })}</TableCell>
                        <TableCell align="center">{t("AdminPage.Delete", { ns: "AdminPage" })}</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {users.map(user => (
                        <TableRow
                          key={user.id}
                          sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                        >
                          <TableCell component="th" scope="row">
                            {user.name}
                          </TableCell>
                          <TableCell align="center">
                            {user.role ? (
                              <Button variant="contained" sx={{paddingLeft: 2.5, paddingRight: 2.5}} color="primary" >
                                {t("AdminPage.Admin", { ns: "AdminPage" })}
                              </Button>
                            ) : (
                              <Button variant="contained" color="secondary" >
                                {t("AdminPage.Handler", { ns: "AdminPage" })}
                              </Button>
                            )}
                          </TableCell>
                          <TableCell align="left">{user.email}</TableCell>
                          <TableCell align="left">{user.title}</TableCell>
                          <TableCell align="left">{user.department}</TableCell>
                          <TableCell align="left">{user.phone}</TableCell>
                          <TableCell align="left">{user.address}</TableCell>
                          <TableCell align="center">
                            <ButtonEdit onClick={() => handleEditClick(user.id)}>{t("AdminPage.Edit", { ns: "AdminPage" })}</ButtonEdit>
                          </TableCell>
                          <TableCell align="center">
                            <ButtonDelete onClick={() => handleDeleteClick(user.id)}>{t("AdminPage.Delete", { ns: "AdminPage" })}</ButtonDelete>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </TabPanel>
          </CardContent>
        </Card>

      </Box>
      <ProfileModal
        open={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
      <EditModal
        open={showEditModal}
        currentId={currentUserId}
        onClose={() => setShowEditModal(false)}
      />
    </DashboardLayout>

  );
}