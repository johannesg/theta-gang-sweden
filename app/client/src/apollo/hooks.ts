import { OptionsQueryResult, useOptionsQuery } from './types';
import { currentExpiry, currentInstrument, currentOptionType } from './vars';
import { useReactiveVar } from '@apollo/client';

export function useCompositeOptionsQuery(): OptionsQueryResult {
    const instrument = useReactiveVar(currentInstrument);
    const optionType = useReactiveVar(currentOptionType);
    const expires = useReactiveVar(currentExpiry);

    const skip = !instrument;

    return useOptionsQuery({ variables: { id: instrument, type: optionType, expires: expires }, skip });
}
