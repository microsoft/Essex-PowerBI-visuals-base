/**
 * A simple function that wraps _.get to add type safety to it
 * * Note * The getter function does not support scope varibles (i.e. you cannot use external variables from within the getter)
 * @param obj The object to get a property on
 * @param getter The getter for the path
 */
export default function get<T, J>(obj: T, getter: (obj: T) => J, defaultValue?: any): J;
