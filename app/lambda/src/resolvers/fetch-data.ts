
import axios from 'axios';
import { OptionType } from '../types';

import { getNextMonth } from '../utils/date';

export async function getInstruments() {
    return getOptionsList("5668", OptionType.Standard, getNextMonth()); // 5668 = XACT OMX30
}

export async function getOptionsList(id: string, optionType: OptionType, expiry: string) {
    const url = 'https://www.avanza.se/optioner-lista.html'

    const params = {
        name: "",
        underlyingInstrumentId: id,
        selectedEndDates: expiry,
        sortField: "NAME",
        sortOrder: "ASCENDING",
        activeTab: "matrix",
        optionTypes: optionType.toUpperCase()
    }

    const res = await axios.get(url, { params });
    return res.data;
}

export async function getOptionInfo(path : string) {
    const url = 'https://www.avanza.se' + path;

    const res = await axios.get(url);

    return res.data;
}