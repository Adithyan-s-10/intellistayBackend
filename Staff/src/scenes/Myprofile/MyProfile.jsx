import React, { useState, useEffect } from "react";
import { Avatar, Box, Button, Grid, Paper, Typography, TextField, useTheme } from "@mui/material";
import {jwtDecode} from "jwt-decode";
import axios from "axios"; // Import axios for API requests
import Swal from 'sweetalert2';

const MyProfile = () => {
  const [editMode, setEditMode] = useState(false); // Track if in edit mode
  const [changePasswordMode, setChangePasswordMode] = useState(false); // Track if in change password mode
  const theme = useTheme(); // Access current theme
  const [userData, setUserData] = useState(null); // Store decoded token data
  const [profileData, setProfileData] = useState({
    displayName: "",
    email: "",
    address: "",
    salary: "",
    image: "",
    role: "",
    phone_no: "",
    dob: ""
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  // Fetch profile data from the server using user data
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        setUserData(decodedToken); // Store the decoded data in the state

        // Fetch the profile data based on user ID or email
        axios.get(`http://localhost:3001/staff/profile/${decodedToken._id}`)
          .then(response => {
            const data = response.data;
            setProfileData({
              displayName: data.displayName,
              email: data.email,
              phone_no: data.phone_no,
              role: data.role,
              address: data.address,
              dob: data.dob,
              salary: data.salary,
              image: "/path-to-default-pic.jpg"
            });
          })
          .catch(error => {
            console.error("Error fetching profile data:", error);
          });

      } catch (error) {
        console.error("Failed to decode token:", error);
      }
    }
  }, []);

  const handleUpdateClick = () => {
    setEditMode(true); // Enable edit mode
  };

  const handleInputChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSave = () => {
    // Update profile data on the server
    axios.put(`http://localhost:3001/staff/profile/${userData._id}`, profileData)
      .then(response => {
        Swal.fire("Success", "Profile updated successfully:", "success");
        setEditMode(false); // Disable edit mode after saving
      })
      .catch(error => {
        Swal.fire("Error", "Error updating profile data:", "error");
      });
  };

  const handlePasswordChange = () => {
    setChangePasswordMode(true); // Enable password change mode
  };

  const handlePasswordInputChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handlePasswordSave = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      Swal.fire("Error", "New password and confirm password do not match!", "error");
      return;
    }

    // Send current password and new password to the backend
    axios.put(`http://localhost:3001/staff/change-password/${userData._id}`, {
      currentPassword: passwordData.currentPassword,
      newPassword: passwordData.newPassword
    })
    .then(response => {
      Swal.fire("Success", "Password changed successfully", "success");
      setChangePasswordMode(false); // Disable password change mode
    })
    .catch(error => {
      Swal.fire("Error", "Current password is incorrect or error updating password", "error");
    });
  };

  return (
    <Paper
      elevation={3}
      sx={{
        padding: 3,
        margin: "auto",
        maxWidth: 600,
        mt: 5,
        borderRadius: 2,
        backgroundColor: theme.palette.mode === 'dark' ? "#333" : "#f9f9f9",
        color: theme.palette.mode === 'dark' ? "#fff" : "#000",
      }}
    >
      {/* Profile Picture and User Info */}
      <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
        <Avatar
          alt={profileData.displayName}
          src={profileData.image}
          sx={{
            width: 150,
            height: 150,
            mb: 2,
            border: `4px solid ${theme.palette.primary.main}`,
          }}
        />
        <Typography variant="h5" fontWeight="bold">
          {profileData.displayName}
        </Typography>
      </Box>

      {/* Profile Details */}
      <Grid container spacing={2}>
        {/* Name Field */}
        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary">
            Name:
          </Typography>
          {editMode ? (
            <TextField
              fullWidth
              name="displayName"
              value={profileData.displayName}
              onChange={handleInputChange}
              sx={{ color: theme.palette.text.primary }}
            />
          ) : (
            <Typography variant="h6">{profileData.displayName}</Typography>
          )}
        </Grid>


        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary">
            Email:
          </Typography>
          {editMode ? (
            <TextField
              fullWidth
              name="email"
              value={profileData.email}
              onChange={handleInputChange}
              InputProps={{ readOnly: true }}
              sx={{ color: theme.palette.text.primary }}
            />
          ) : (
            <Typography variant="h6">{profileData.email}</Typography>
          )}
        </Grid>

        {/* Phone Number */}
        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary">
            Phone Number:
          </Typography>
          {editMode ? (
            <TextField
              fullWidth
              name="phone_no"
              value={profileData.phone_no}
              onChange={handleInputChange}
              sx={{ color: theme.palette.text.primary }}
            />
          ) : (
            <Typography variant="h6">{profileData.phone_no}</Typography>
          )}
        </Grid>


        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary">
            Role:
          </Typography>
          {editMode ? (
            <TextField
              fullWidth
              name="role"
              value={profileData.role}
              onChange={handleInputChange}
              sx={{ color: theme.palette.text.primary }}
            />
          ) : (
            <Typography variant="h6">{profileData.role}</Typography>
          )}
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary">
            Dob:
          </Typography>
          {editMode ? (
            <TextField
              fullWidth
              name="dob"
              value={profileData.dob}
              onChange={handleInputChange}
              sx={{ color: theme.palette.text.primary }}
            />
          ) : (
            <Typography variant="h6">{profileData.dob}</Typography>
          )}
        </Grid>
        {/* Address */}
        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary">
            Address:
          </Typography>
          {editMode ? (
            <TextField
              fullWidth
              name="address"
              value={profileData.address}
              onChange={handleInputChange}
              sx={{ color: theme.palette.text.primary }}
            />
          ) : (
            <Typography variant="h6">{profileData.address}</Typography>
          )}
        </Grid>

        {/* Salary */}
        <Grid item xs={12}>
          <Typography variant="body1" color="textSecondary">
            Salary:
          </Typography>
          {editMode ? (
            <TextField
              fullWidth
              name="salary"
              value={profileData.salary}
              onChange={handleInputChange}
              InputProps={{ readOnly: true }}
              sx={{ color: theme.palette.text.primary }}
            />
          ) : (
            <Typography variant="h6">{profileData.salary}</Typography>
          )}
        </Grid>
      </Grid>

      {/* Button for Edit and Save */}
      <Box display="flex" justifyContent="center" mt={4}>
        {editMode ? (
          <Button variant="contained" color="primary" onClick={handleSave}>
            Save Changes
          </Button>
        ) : (
          <Button variant="contained" color="primary" onClick={handleUpdateClick}>
            Update Details
          </Button>
        )}
      </Box>

      {/* Change Password Section */}
      <Box display="flex" justifyContent="center" mt={4}>
  {changePasswordMode ? (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      gap={2} // Add some spacing between elements
      width="100%" // Ensure the inputs take full width
    >
      <TextField
        fullWidth
        label="Current Password"
        name="currentPassword"
        type="password"
        value={passwordData.currentPassword}
        onChange={handlePasswordInputChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="New Password"
        name="newPassword"
        type="password"
        value={passwordData.newPassword}
        onChange={handlePasswordInputChange}
        sx={{ mb: 2 }}
      />
      <TextField
        fullWidth
        label="Confirm New Password"
        name="confirmPassword"
        type="password"
        value={passwordData.confirmPassword}
        onChange={handlePasswordInputChange}
        sx={{ mb: 2 }}
      />
      <Button variant="contained" color="primary" onClick={handlePasswordSave}>
        Save Password
      </Button>
    </Box>
  ) : (
    <Button variant="contained" color="secondary" onClick={handlePasswordChange}>
      Change Password
    </Button>
  )}
</Box>
    </Paper>
  );
};

export default MyProfile;
