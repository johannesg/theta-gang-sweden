import MenuItem from "@material-ui/core/MenuItem";
import Select from "@material-ui/core/Select";
import React from "react";
import { Instrument, useGetInstrumentsQuery } from "../apollo/types";
import { currentInstrument } from '../apollo/cache';
import { useReactiveVar } from "@apollo/client";

export function SelectInstrument() {
    const { loading, error, data } = useGetInstrumentsQuery();

    const instrumentVar = useReactiveVar(currentInstrument);

    const handleSelect = (event: React.ChangeEvent<{ value: unknown }>) => {
        currentInstrument(event.target.value as string);
      };
    
    return <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={instrumentVar}
        onChange={handleSelect}
    >
        {loading ?
            <MenuItem key={0} value={""}>Loading...</MenuItem>
            : data?.instruments?.map(i => <MenuItem key={i?.id} value={i?.id}>{i?.name}</MenuItem>
            )
        }
    </Select>


}