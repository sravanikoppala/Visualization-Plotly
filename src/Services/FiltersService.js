import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core';


export function useForm(initialValues) {

    const [values, setValues] = useState(initialValues);
    const handleInputChange = event => {
        const {name, value} = event.target;
        setValues({
          ...values,
          [name]: value
        })
    }

    return {
        values,
        handleInputChange
    };
}
const useStyles = makeStyles((theme) => ({
    formControl: {
        '& .MuiFormControl-root':{           
            minWidth: 120,
            margin: theme.spacing(1),
            marginTop: theme.spacing(4)
        }     
    } 
}));

export function Form(props) { 
    const classes = useStyles();

    return (
        <form className={classes.formControl}>
            {props.children}
        </form>
    )
}
