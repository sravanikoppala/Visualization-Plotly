import React from 'react';
import { Button as MuiButton, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
    root: {
        marginTop: theme.spacing(1),
        margin: theme.spacing(1)
    },
    label: {
        minWidth: 60,
        margin: theme.spacing(0.7)
    }
}));

export default function Button(props) {
    const classes = useStyles();

    const { text, size, color, variant, onClick, ...other } = props
    return (
        <MuiButton classes={{ root: classes.root, label: classes.label }} variant={variant || "contained"} size={size || "large"} color={color || "primary"} onClick={onClick} {...other} >{text}</MuiButton>
    )
}
