import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Profile from './Profile.jpg';
import { createTheme, ThemeProvider } from "@mui/material/styles";
import { auth, firestore as db } from "../firebase";

import {
    createUserWithEmailAndPassword,
} from "firebase/auth";

import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";

const theme = createTheme();

export default function SignUp() {
    const [username, setUsername] = React.useState("");
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const userCredential = await createUserWithEmailAndPassword(
                auth,
                email,
                password
            );

            const user = userCredential.user;

            setDoc(doc(db, "admin_users", user.uid), {
                username: username,
                email: email,
                userId: user.uid,
                timestamp: new Date(),
            });

            navigate("/");
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <ThemeProvider theme={theme}>
            <Box
                sx={{
                    background: "linear-gradient(to bottom, #3b3b4a, #9998b3)", // Set linear gradient background color from top to bottom
                    minHeight: "100vh", // Set minimum height to full viewport height
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Container component="main" maxWidth="xs">

                    <CssBaseline />
                    <Box
                        sx={{
                            background:"#3b3b4a" ,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            border: "1px solid white", 
                            padding: "20px", 
                            borderRadius: "5px", 
                            color: "white",
                        }}
                    >
                         <img 
                                src={Profile} 
                                alt="Profile" 
                                style={{ 
                                    width: "150px", 
                                    height: "150px", 
                                    borderRadius: "50%", 
                                    marginBottom: "20px" 
                                }} 
                            />
                        <Typography component="h1" variant="h5">
                            Register
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{ mt: 1 }}
                           
                        >
                            <TextField
                                autoComplete="given-name"
                                name="firstName"
                                required
                                fullWidth
                                id="firstName"
                                label="Full Name"
                                autoFocus
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                sx={{ color: 'white', mb: 2 }} // Add margin bottom
                                InputLabelProps={{ style: { color: 'white' } }} // Style for label text
                                InputProps={{
                                    style: { color: 'white' }, // Style for input text
                                    sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }, // Style for input border
                                }}
                                variant="outlined" // Use outlined variant for customizing border
                            />
                            <TextField
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                sx={{ color: 'white', mb: 2 }} // Add margin bottom
                                InputLabelProps={{ style: { color: 'white' } }} // Style for label text
                                InputProps={{
                                    style: { color: 'white' }, // Style for input text
                                    sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }, // Style for input border
                                }}
                                variant="outlined" // Use outlined variant for customizing border
                            />
                            <TextField
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="new-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                sx={{ color: 'white', mb: 2 }} // Add margin bottom
                                InputLabelProps={{ style: { color: 'white' } }} // Style for label text
                                InputProps={{
                                    style: { color: 'white' }, // Style for input text
                                    sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }, // Style for input border
                                }}
                                variant="outlined" // Use outlined variant for customizing border
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign Up
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/" variant="body2" sx={{ color: "white" }}>
                                        Already have an account? Sign in
                                    </Link>
                                </Grid>
                            </Grid>
                        </Box>
                    </Box>
                </Container>
            </Box>
        </ThemeProvider>
    );
}
