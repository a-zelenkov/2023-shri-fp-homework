/**
 * @file Домашка по FP ч. 2
 *
 * Подсказки:
 * Метод get у инстанса Api – каррированый
 * GET / https://animals.tech/{id}
 *
 * GET / https://api.tech/numbers/base
 * params:
 * – number [Int] – число
 * – from [Int] – из какой системы счисления
 * – to [Int] – в какую систему счисления
 *
 * Иногда промисы от API будут приходить в состояние rejected, (прямо как и API в реальной жизни)
 * Ответ будет приходить в поле {result}
 */
import {
    allPass,
    andThen,
    curry,
    gt,
    gte,
    identity,
    ifElse,
    length,
    lt,
    otherwise,
    pipe,
    replace,
    tap,
    test,
} from "ramda";

import Api from "../tools/api";

const api = new Api();

const isDigit = (value) => test(/[0-9,]+/, value);
const isPositive = (value) => gte(value, 0);
const moreThanTwoSymbols = (value) => gt(length(value), 2);
const lessThanTenSymbols = (value) => lt(length(value), 10);

const isValid = allPass([isDigit, isPositive, moreThanTwoSymbols, lessThanTenSymbols]);

const getNum = (value) => api.get("https://api.tech/numbers/base", { from: 10, to: 2, number: value });
const getAnimal = (id) => api.get(`https:/animals.tech/${id}`, {});

const useWith = curry((fn, targets, value) => {
    targets.forEach((target) => {
        value = fn(target(value));
    });
    return value;
});

const toFloat = replace(",", ".");
const sqr = (value) => value ** 2;
const divisionRemainder = (value) => value % 3;

const processSequence = ({ value, writeLog, handleSuccess, handleError }) => {
    pipe(
        tap(writeLog),
        ifElse(
            isValid,
            pipe(
                toFloat,
                Math.round,
                tap(writeLog),
                getNum,
                andThen(({ result }) =>
                    pipe(
                        useWith(tap(writeLog), [identity, length, sqr, divisionRemainder]),
                        getAnimal,
                        andThen(({ result }) => handleSuccess(result)),
                        otherwise(handleError)
                    )(result)
                ),
                otherwise(handleError)
            ),
            (err) => handleError("ValidationError")
        )
    )(value);
};

export default processSequence;
