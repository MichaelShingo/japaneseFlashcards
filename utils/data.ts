type ObjectKeys = string | number | symbol;

export const reverseObject = <K extends ObjectKeys, V extends ObjectKeys>(obj: Record<K, V>): Record<V, K> => {
    return Object.fromEntries(
        Object.entries(obj).map(
            ([key, value]) => [value, key]
        )
    ) as Record<V, K>;
};