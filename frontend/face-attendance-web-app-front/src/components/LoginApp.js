import React from 'react';
import {
    Button,
    TextField,
    Grid,
    Paper,
    Typography,
    Link,
    Radio,
    RadioGroup,
    FormControlLabel,
    FormControl,
    FormLabel,
} from "@material-ui/core";
import "./LoginApp.css";

const LoginApp = () => {
    return (
        <Grid container spacing={0} justifyContent="center" direction="row">
            <Grid item>
                <Grid container direction="column" justifyContent="center" spacing={2} className="login-form">
                    <Paper variant="elevation" elevation={2} className="login-background">
                        <Grid container direction="row" spacing={4}>
                            {/* Sign In Section */}
                            <Grid item container direction="column" xs={6}>
                                <Grid item>
                                    <Typography component="h1" variant="h5">
                                        Sign in
                                    </Typography>
                                </Grid>
                                <Grid item>
                                    <form>
                                        <Grid container direction="column" spacing={2}>
                                            <Grid item>
                                                <TextField
                                                    type="email"
                                                    label="Email"
                                                    fullWidth
                                                    name="email"
                                                    variant="outlined"
                                                    required
                                                    autoFocus
                                                />
                                            </Grid>
                                            <Grid item>
                                                <TextField
                                                    type="password"
                                                    label="Password"
                                                    fullWidth
                                                    name="password"
                                                    variant="outlined"
                                                    required
                                                />
                                            </Grid>
                                            <Grid item>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    type="submit"
                                                    className="button-block"
                                                >
                                                    Submit
                                                </Button>
                                            </Grid>
                                        </Grid>
                                    </form>
                                </Grid>
                                <Grid item>
                                    <Link href="#" variant="body2">
                                        Forgot Password?
                                    </Link>
                                </Grid>
                            </Grid>
                            {/* Create Account Section */}
                            <Grid item container direction="column" xs={6}>
                                <Typography component="h1" variant="h5">
                                    Create Account
                                </Typography>
                                <form>
                                    <Grid container direction="column" spacing={2}>
                                        <Grid item>
                                            <TextField
                                                type="text"
                                                label="First Name"
                                                fullWidth
                                                name="firstName"
                                                variant="outlined"
                                                required
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                type="text"
                                                label="Last Name"
                                                fullWidth
                                                name="lastName"
                                                variant="outlined"
                                                required
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                type="email"
                                                label="Email"
                                                fullWidth
                                                name="email"
                                                variant="outlined"
                                                required
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                type="password"
                                                label="Password"
                                                fullWidth
                                                name="password"
                                                variant="outlined"
                                                required
                                            />
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                type="password"
                                                label="Re-enter password"
                                                fullWidth
                                                name="confirmPassword"
                                                variant="outlined"
                                                required
                                            />
                                        </Grid>
                                        <Grid item>
                                            <FormControl component="fieldset">
                                                <FormLabel component="legend">Role</FormLabel>
                                                <RadioGroup row name="role">
                                                    <FormControlLabel
                                                        value="student"
                                                        control={<Radio color="primary" />}
                                                        label="Student"
                                                    />
                                                    <FormControlLabel
                                                        value="teacher"
                                                        control={<Radio color="primary" />}
                                                        label="Teacher"
                                                    />
                                                </RadioGroup>
                                            </FormControl>
                                        </Grid>
                                        <Grid item>
                                            <TextField
                                                type="text"
                                                label="Roll"
                                                fullWidth
                                                name="roll"
                                                variant="outlined"
                                            />
                                        </Grid>
                                        <Grid container spacing={2}>
                                            <Grid item xs={4}>
                                                <TextField
                                                    type="text"
                                                    label="Degree"
                                                    fullWidth
                                                    name="degree"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField
                                                    type="text"
                                                    label="Year"
                                                    fullWidth
                                                    name="year"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                            <Grid item xs={4}>
                                                <TextField
                                                    type="text"
                                                    label="Stream"
                                                    fullWidth
                                                    name="stream"
                                                    variant="outlined"
                                                />
                                            </Grid>
                                        </Grid>
                                        <Grid item>
                                            <Button
                                                variant="contained"
                                                color="primary"
                                                type="submit"
                                                className="button-block"
                                            >
                                                Create
                                            </Button>
                                        </Grid>
                                    </Grid>
                                </form>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>
            </Grid>
        </Grid>
    );
};

export default LoginApp;
