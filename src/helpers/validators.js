/**
 * @file Домашка по FP ч. 1
 *
 * Основная задача — написать самому, или найти в FP библиотеках функции anyPass/allPass
 * Эти функции/их аналоги есть и в ramda и в lodash
 *
 * allPass — принимает массив функций-предикатов, и возвращает функцию-предикат, которая
 * вернет true для заданного списка аргументов, если каждый из предоставленных предикатов
 * удовлетворяет этим аргументам (возвращает true)
 *
 * anyPass — то же самое, только удовлетворять значению может единственная функция-предикат из массива.
 *
 * Если какие либо функции написаны руками (без использования библиотек) это не является ошибкой
 */
import {
    allPass,
    anyPass,
    compose,
    converge,
    curry,
    equals,
    filter,
    gte,
    keys,
    length,
    not,
    pipe,
    prop,
    propEq,
} from "ramda";
import { COLORS, SHAPES } from "../constants";
import curryRight from "lodash/curryRight";

const circleEq = (prop) => curry(propEq)(SHAPES.CIRCLE, prop);
const squareEq = (prop) => curry(propEq)(SHAPES.SQUARE, prop);
const triangleEq = (prop) => curry(propEq)(SHAPES.TRIANGLE, prop);
const starEq = (prop) => curry(propEq)(SHAPES.STAR, prop);

const isWhiteCircle = circleEq(COLORS.WHITE);
// const isRedCircle = circleEq(COLORS.RED);
const isOrangeCircle = circleEq(COLORS.ORANGE);
const isGreenCircle = circleEq(COLORS.GREEN);
const isBlueCircle = circleEq(COLORS.BLUE);

// const isWhiteSquare = squareEq(COLORS.WHITE);
// const isRedSquare = squareEq(COLORS.RED);
const isOrangeSquare = squareEq(COLORS.ORANGE);
const isGreenSquare = squareEq(COLORS.GREEN);
// const isBlueSquare = squareEq(COLORS.BLUE);

const isWhiteTriangle = triangleEq(COLORS.WHITE);
// const isRedTriangle = triangleEq(COLORS.RED);
const isOrangeTriangle = triangleEq(COLORS.ORANGE);
const isGreenTriangle = triangleEq(COLORS.GREEN);
// const isBlueTriangle = triangleEq(COLORS.BLUE);

const isWhiteStar = starEq(COLORS.WHITE);
const isRedStar = starEq(COLORS.RED);
const isOrangeStar = starEq(COLORS.ORANGE);
const isGreenStar = starEq(COLORS.GREEN);
// const isBlueStar = starEq(COLORS.BLUE);

const greaterOrEquals = curryRight(gte);
const justEquals = curryRight(equals);

const lengthOf = pipe(keys, length);

const byColor = (color) => filter((c) => c === color);

const lengthOfRed = compose(lengthOf, byColor(COLORS.RED));
const lengthOfOrange = compose(lengthOf, byColor(COLORS.ORANGE));
const lengthOfGreen = compose(lengthOf, byColor(COLORS.GREEN));
const lengthOfBlue = compose(lengthOf, byColor(COLORS.BLUE));

// 1. Красная звезда, зеленый квадрат, все остальные белые.
export const validateFieldN1 = allPass([isWhiteCircle, isGreenSquare, isWhiteTriangle, isRedStar]);

// 2. Как минимум две фигуры зеленые.
export const validateFieldN2 = pipe(lengthOfGreen, greaterOrEquals(2));

// 3. Количество красных фигур равно кол-ву синих.
export const validateFieldN3 = converge(equals, [lengthOfRed, lengthOfBlue]);

// 4. Синий круг, красная звезда, оранжевый квадрат треугольник любого цвета
export const validateFieldN4 = allPass([isBlueCircle, isOrangeSquare, isRedStar]);

// 5. Три фигуры одного любого цвета кроме белого (четыре фигуры одного цвета – это тоже true).
export const validateFieldN5 = anyPass([
    pipe(lengthOfRed, greaterOrEquals(3)),
    pipe(lengthOfOrange, greaterOrEquals(3)),
    pipe(lengthOfGreen, greaterOrEquals(3)),
    pipe(lengthOfBlue, greaterOrEquals(3)),
]);

// 6. Ровно две зеленые фигуры (одна из зелёных – это треугольник), плюс одна красная. Четвёртая оставшаяся любого доступного цвета, но не нарушающая первые два условия
export const validateFieldN6 = allPass([
    isGreenTriangle,
    pipe(lengthOfGreen, justEquals(2)),
    pipe(lengthOfRed, justEquals(1)),
]);

// 7. Все фигуры оранжевые.
export const validateFieldN7 = allPass([isOrangeCircle, isOrangeSquare, isOrangeTriangle, isOrangeStar]);

// 8. Не красная и не белая звезда, остальные – любого цвета.
export const validateFieldN8 = compose(not, anyPass([isWhiteStar, isRedStar]));

// 9. Все фигуры зеленые.
export const validateFieldN9 = allPass([isGreenCircle, isGreenSquare, isGreenTriangle, isGreenStar]);

// 10. Треугольник и квадрат одного цвета (не белого), остальные – любого цвета
export const validateFieldN10 = allPass([
    compose(not, isWhiteTriangle),
    converge(equals, [prop(SHAPES.TRIANGLE), prop(SHAPES.SQUARE)]),
]);
