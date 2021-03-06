import * as React from 'react'
import { useEffect, useState } from 'react';
import { Button, Grid, IconButton, makeStyles, Toolbar, Typography } from '@material-ui/core'
import { AppBar } from '@material-ui/core'
import MenuIcon from '@material-ui/icons/Menu'

type LayoutProps = {
    title: string
    children: React.ReactNode
}

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
      },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
    },
}));

export default ({ title, children }: LayoutProps) => {
    const classes = useStyles();
    // const [user, setUser] = useState<UserInfo | undefined>();

    // useEffect(() => {
    //     return subscribeToUser(({ user }) =>  {
    //             setUser(user);
    //     });
    // }, []);

    return <Grid container>
        <Grid item xs={12}>
            <AppBar position="fixed" className={classes.appBar}>
                <Toolbar>
                    <IconButton edge="start" className={classes.menuButton} color="inherit" aria-label="menu">
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" className={classes.title}>
                        {title}
                    </Typography>
                    {/* <Profile user={user}/> */}
                </Toolbar>
            </AppBar>
        </Grid>
        <Grid item xs={false} sm={1} />
        <Grid item container xs={12} sm={10}>
            {children}
        </Grid>
        <Grid item xs={false} sm={1} />
    </Grid>
}