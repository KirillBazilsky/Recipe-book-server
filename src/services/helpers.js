export const mergeDefined = (argumentsObj, existingObj) => {
    return Object.fromEntries(
      Object.entries({ ...existingObj, ...argumentsObj }).filter(
        ([_, value]) => value !== undefined && value !== null
      )
    );
  };