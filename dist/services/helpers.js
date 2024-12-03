"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isUserJwtPayload = exports.isMongoError = exports.mergeDefined = void 0;
const mergeDefined = (argumentsObj, existingObj) => {
    return Object.fromEntries(Object.entries({ ...existingObj, ...argumentsObj }).filter(([_, value]) => value !== undefined && value !== null));
};
exports.mergeDefined = mergeDefined;
const isMongoError = (error) => {
    return !!(error && typeof error === 'object' && 'code' in error && typeof error.code === 'number');
};
exports.isMongoError = isMongoError;
const isUserJwtPayload = (payload) => {
    return !!(payload && typeof payload === "object" && "userId" in payload && "name" in payload && "favoritesId" in payload);
};
exports.isUserJwtPayload = isUserJwtPayload;
