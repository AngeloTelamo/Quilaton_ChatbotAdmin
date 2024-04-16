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
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";

const theme = createTheme();

export default function SignIn() {
    const [email, setEmail] = React.useState("");
    const [password, setPassword] = React.useState("");

    const navigate = useNavigate();
    const handleSubmit = async (event) => {
        event.preventDefault();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                // Signed in
                //const user = userCredential.user;
                navigate("/chat-home/1"); //navigate route
            })
            .catch((error) => {
                const errorMessage = error.message;
                alert(errorMessage);
            });
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
                            backdropFilter: "blur(8px)",
                        }}
                    >
                        <img
                                src={Profile} 
                                alt="Profile" 
                                style={{ 
                                    width: "150px", // Adjust the width as needed
                                    height: "150px", // Adjust the height to maintain aspect ratio
                                    borderRadius: "50%", // Make it circular
                                    marginBottom: "20px" 
                                }} 
                            />

                        <Typography component="h1" variant="h5" textAlign="center">
                        Welcome to Quilaton Office Administrator
                        </Typography>
                        
                        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="email"
                                label="Email Address"
                                name="email"
                                autoComplete="email"
                                autoFocus
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                InputLabelProps={{ style: { color: 'white' } }} // Style for label text
                                InputProps={{
                                    style: { color: 'white' }, // Style for input text
                                    sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }, // Style for input border
                                }}
                                variant="outlined"
                            />

                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                name="password"
                                label="Password"
                                type="password"
                                id="password"
                                autoComplete="current-password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                InputLabelProps={{ style: { color: 'white' } }} // Style for label text
                                InputProps={{
                                    style: { color: 'white' }, // Style for input text
                                    sx: { '& .MuiOutlinedInput-notchedOutline': { borderColor: 'white' } }, // Style for input border
                                }}
                                
                                variant="outlined"
                            />

                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Login
                            </Button>
                            <Grid container justifyContent="flex-end">
                                <Grid item>
                                    <Link href="/Signup" variant="body2" sx={{ color: "white" }}>
                                        {"Don't have an account? Sign Up"}
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
