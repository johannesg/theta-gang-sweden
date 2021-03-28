
import axios from 'axios';

export async function getInstruments() {
    return getOptionsList("5429");
    // const url = 'https://www.avanza.se/optioner-lista.html'

    // const res = await axios.get(url);
    // return res.data;
}

export async function getOptionsList(id: string) {
    const url = 'https://www.avanza.se/optioner-lista.html'

    const params = {
        name: "",
        underlyingInstrumentId: id,
        selectedEndDates: "2021-04",
        sortField: "NAME",
        sortOrder: "ASCENDING",
        activeTab: "matrix",
        optionTypes: "STANDARD"
    }

    const res = await axios.get(url, { params });
    return res.data;
}

export async function getOptionInfo(path : string) {
    const url = 'https://www.avanza.se' + path;

    const res = await axios.get(url);

    return res.data;
}