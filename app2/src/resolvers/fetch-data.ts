
import axios from '../utils/axios';
import { OptionType } from '../types';

import { getNextMonth } from '../../src/utils/date';

export type FetchError = {
    error: string
}

export async function getInstruments() {
    return getOptionsList("5668", OptionType.Standard, getNextMonth(), "overview"); // 5668 = XACT OMX30
}

export async function getOptionsList(id: string, optionType: OptionType, expiry: string, activeTab: string, page?: number) {
    const url = '/optioner-lista.html'

    const params = {
        name: "",
        underlyingInstrumentId: id,
        selectedEndDates: expiry,
        sortField: "NAME",
        sortOrder: "ASCENDING",
        activeTab,
        page,
        optionTypes: optionType.toUpperCase()
    }

    const { status, statusText, data } = await axios.get(url, { params });
    if (status != 200) {
        console.log(`Got wrong status from Avanza: ${status}:${statusText}`);
        console.log(`Response: ${data}`);
        throw { error: "Invalid status code: " + status };
    }

    return data;
}

export async function getOptionInfo(path : string) {
    const url = path;

    const { status, statusText, data } = await axios.get(url);
    if (status != 200) {
        console.log(`Got wrong status from Avanza: ${status}:${statusText}`);
        console.log(`Response: ${data}`);
        throw { error: "Invalid status code: " + status };
    }
    return data;
}
