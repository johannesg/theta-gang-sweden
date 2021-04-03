import React from "react";
import { OptionType, useGetInstrumentsQuery } from "../apollo/types";
import { currentInstrument, currentExpiry, currentOptionType} from '../apollo/vars';
import { useReactiveVar } from "@apollo/client";
import { createStyles, FormControl, InputLabel, makeStyles, MenuItem, Select, Theme } from "@material-ui/core";
import { getNextMonths } from "../utils/date";

const useStyles = makeStyles((theme: Theme) =>
    createStyles({
        formControl: {
            margin: theme.spacing(1),
            minWidth: 120,
        },
        selectEmpty: {
            marginTop: theme.spacing(2),
        },
    }),
);

export function SelectInstrument() {
    const classes = useStyles();

    const { loading, error, data } = useGetInstrumentsQuery();

    const instrumentVar = useReactiveVar(currentInstrument);

    const handleSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        currentInstrument(event.target.value as string);
    };

    return <FormControl className={classes.formControl}>
        <InputLabel id="select-instrument-label" >Underlying</InputLabel>
        <Select
            labelId="select-instrument-label"
            id="select-instrument"
            value={instrumentVar}
            onChange={handleSelect}
        >
            {loading ?
                <MenuItem key={0} value={""}>Loading...</MenuItem>
                : data?.instruments?.map(i => <MenuItem key={i?.id} value={i?.id}>{i?.name}</MenuItem>
                )
            }
        </Select>
    </FormControl>
}

function SelectOptionType() {
    const classes = useStyles();

    const optionType = useReactiveVar(currentOptionType);

    const handleSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        currentOptionType(event.target.value as OptionType);
    };

    return <FormControl className={classes.formControl}>
        <InputLabel id="select-optiontype-label" >Option type</InputLabel>
        <Select
            labelId="select-optiontype-label"
            id="select-optiontype"
            value={optionType}
            onChange={handleSelect}
        >
            <MenuItem value={OptionType.Weekly} >Weekly</MenuItem>
            <MenuItem value={OptionType.Standard} >Option</MenuItem>
        </Select>
    </FormControl>
}

function SelectExpiry() {
    const classes = useStyles();

    const expiry = useReactiveVar(currentExpiry);

    const handleSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        currentExpiry(event.target.value as string);
    };

    const months = getNextMonths(12);

    const items = months.map(m => <MenuItem key={m} value={m}>{m}</MenuItem>);

    return <FormControl className={classes.formControl}>
        <InputLabel id="select-expiry-label" >Expiry</InputLabel>
        <Select
            labelId="select-expiry-label"
            id="select-optiontype"
            value={expiry}
            onChange={handleSelect}
        >
            {items}
        </Select>
    </FormControl>
}

export function OptionFilters() {
    return <div>
        <SelectInstrument></SelectInstrument>
        <SelectOptionType></SelectOptionType>
        <SelectExpiry></SelectExpiry>
    </div>
}