//<String, T> generic map, used only in one place, but could be useful in future development
interface StringMap<T> {
    [key : string] : T
}

export default StringMap;
