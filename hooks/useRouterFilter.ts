import { useRouter } from "next/router";
import { ParsedUrlQuery } from "querystring";

interface UseRouterParamsOptions {
  method?: "push" | "replace";
  shallow?: boolean;
}

const useRouterParams = (options?: UseRouterParamsOptions) => {
  const { query, pathname, push, replace } = useRouter();

  const reload = options?.method === "replace" ? replace : push;
  const shallow = options?.shallow ?? true;

  /**
   *  Retrieves from the URL the value of the provided param.
   * @param name The name of the param.
   * @returns The value of the param.
   */
  const getParamValue = (name: string) => {
    const value = query[name];
    return !value
      ? value
      : Array.isArray(value)
      ? value.map((el) => decodeURIComponent(el))
      : decodeURIComponent(value);
  };

  /**
   * It sets a query param in the URL to a given value. If it already exists, it
   * will be overriden.
   * @param name The name of the param.
   * @param value The value of the param, it can be single or multiple values.
   */
  const setParam = (
    name: string,
    value?: string | boolean | number | string[] | boolean[] | number[]
  ) => {
    if (!value) {
      removeParam(name);
      return;
    }
    const { [name]: param, ...rest } = query;
    reload(
      {
        pathname,
        query: {
          ...rest,
          [name]: Array.isArray(value)
            ? value.map((el) => encodeURIComponent(el))
            : encodeURIComponent(value),
        },
      },
      undefined,
      { shallow }
    );
  };

  /**
   * If no argument is passed, it clears all the query params from the URL.
   * If one or more params are passed as arguments, only those will be cleared
   * from the URL.
   * @param params one or more params to remove.
   */
  const clearParams = (...params: string[]) => {
    // Clear all params
    if (!params.length) {
      reload(
        {
          pathname,
        },
        undefined,
        { shallow }
      );
      return;
    }
    // Clear the given params
    const newQuery = Object.keys(query).reduce((acc, curr) => {
      if (params.indexOf(curr) === -1) {
        acc[curr] = query[curr];
      }
      return acc;
    }, {} as ParsedUrlQuery);

    reload(
      {
        pathname,
        query: newQuery,
      },
      undefined,
      { shallow }
    );
  };

  /**
   * Removes the provided params with a specific value from the URL.
   * @param name The name of the param.
   * @param value The value of the param.
   */
  const removeParam = (
    name: string,
    value?: string | number | boolean | string[] | number[] | boolean[]
  ) => {
    const { [name]: param, ...rest } = query;

    if (!param) {
      return;
    }

    let newQuery;
    if (value && Array.isArray(param) && !Array.isArray(value)) {
      newQuery = {
        ...rest,
        [name]: param.filter(
          (element) => element !== encodeURIComponent(value)
        ),
      };
    } else {
      newQuery = { ...rest };
    }

    reload(
      {
        pathname,
        query: newQuery,
      },
      undefined,
      { shallow }
    );
  };

  /**
   * Adds the query param to the URL if it's not already there or removes it
   * otherwise.
   * @param name The name of the param.
   * @param value The value of the param.
   */
  const toggleParam = (name: string, value: string | boolean | number) => {
    const { [name]: param, ...rest } = query;

    let newQuery;
    if (!param) {
      // It doesn't exists -> add it.
      newQuery = { ...rest, [name]: encodeURIComponent(value) };
    } else if (Array.isArray(param)) {
      if (param.indexOf(encodeURIComponent(value)) > -1) {
        // There are multiple values for the same param and the value it's there
        // -> remove the value.
        newQuery = {
          ...rest,
          [name]: param.filter(
            (element) => element !== encodeURIComponent(value)
          ),
        };
      } else {
        // There are multiple values for the same param and the value it's not there
        // -> add the new value.
        newQuery = { ...rest, [name]: [...param, encodeURIComponent(value)] };
      }
    } else {
      if (param === encodeURIComponent(value)) {
        // The param exists with the same value -> remove it from the url.
        newQuery = { ...rest };
      } else {
        // The param exists with other values -> add the value.
        newQuery = { ...rest, [name]: [param, encodeURIComponent(value)] };
      }
    }

    reload(
      {
        pathname,
        query: newQuery,
      },
      undefined,
      { shallow }
    );
  };

  return {
    getParamValue,
    setParam,
    clearParams,
    toggleParam,
  };
};
export { useRouterParams };
