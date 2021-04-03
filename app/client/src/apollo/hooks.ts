import { GetOptionsQueryResult, useGetOptionsQuery } from './types';
import { currentExpiry, currentInstrument, currentOptionType } from './vars';
import { useReactiveVar } from '@apollo/client';

export function useOptionsQuery(): GetOptionsQueryResult {
    const instrument = useReactiveVar(currentInstrument);
    const optionType = useReactiveVar(currentOptionType);
    const expires = useReactiveVar(currentExpiry);

    const skip = !instrument;

    return useGetOptionsQuery({ variables: { id: instrument, type: optionType, expires: expires }, skip });
}
