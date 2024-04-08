import * as React from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
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
                const user = userCredential.user;
                navigate("/chat-home/1");
                // ...
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
                    backgroundColor: "#B4B4B8", // Set background color to grey
                    minHeight: "100vh", // Set minimum height to full viewport height
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Container component="main" maxWidth="xs" >
                    <CssBaseline />
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            border: "1px solid white", 
                            padding: "20px", 
                            borderRadius: "5px", 
                            color: "white",
                        }}
                    >

                        <Typography component="h1" variant="h5">
                            Sign in
                        </Typography>

                        <Box
                            component="form"
                            onSubmit={handleSubmit}
                            noValidate
                            sx={{ mt: 1 }}
                           
                        >
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
                                variant="outlined" // Use outlined variant for customizing border
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
                                variant="outlined" // Use outlined variant for customizing border
                            />
                            <FormControlLabel
                                control={<Checkbox value="remember" sx={{ color: "white" }} />}
                                label="Remember me"
                            />
                            <Button
                                type="submit"
                                fullWidth
                                variant="contained"
                                sx={{ mt: 3, mb: 2 }}
                            >
                                Sign In
                            </Button>
                            <Grid container>
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
