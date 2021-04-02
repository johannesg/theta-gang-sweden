import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React from "react";
import { useGetInstrumentsQuery } from "../apollo/types";


export function SelectInstrument() {
    const { loading, error, data } = useGetInstrumentsQuery();

    return <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
    >
        {loading ?
            <MenuItem value={0}>Loading...</MenuItem>
            : data?.instruments?.map(i => <MenuItem value={i.id}>{i.name}</MenuItem>
            )
        }
    </Select>


}