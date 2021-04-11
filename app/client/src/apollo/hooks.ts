import { DetailsQueryResult, OptionsQueryResult, useDetailsQuery, useOptionsQuery } from './types';
import { currentExpiry, currentInstrument, currentOptionType } from './vars';
import { useReactiveVar } from '@apollo/client';

export function useCompositeOptionsQuery(): OptionsQueryResult {
    const instrument = useReactiveVar(currentInstrument);
    const optionType = useReactiveVar(currentOptionType);
    const expires = useReactiveVar(currentExpiry);

    const skip = !instrument;

    return useOptionsQuery({
        // pollInterval: 30000, 
        variables: { id: instrument, type: optionType, expires: expires },
        skip,
        notifyOnNetworkStatusChange: true,
    });
}

export function useOptionDetailsQuery(href: string | undefined): DetailsQueryResult {
    const skip = !href ? true : false;

    return useDetailsQuery({
        // pollInterval: 30000, 
        skip,
        variables: { href: href ?? "" }
    });
}

