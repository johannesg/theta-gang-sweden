import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React from "react";
import { Instrument, useGetInstrumentsQuery } from "../apollo/types";
import { currentInstrument } from '../apollo/cache';

export function SelectInstrument() {
    const { loading, error, data } = useGetInstrumentsQuery();

    const handleSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        currentInstrument(event.target.value as Instrument);
      };
    

    return <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={currentInstrument()}
        onChange={handleSelect}
    >
        {loading ?
            <MenuItem value={0}>Loading...</MenuItem>
            : data?.instruments?.map(i => <MenuItem value={i?.id}>{i?.name}</MenuItem>
            )
        }
    </Select>


}