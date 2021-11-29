/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: DuplicateActionGroupGetData
// ====================================================

export interface DuplicateActionGroupGetData_getActionGroup {
  __typename: "ActionGroup";
  /**
   * `ActionGroup` ID
   */
  id: string;
  /**
   * `ActionGroup` name
   */
  name: string;
}

export interface DuplicateActionGroupGetData {
  /**
   * @bound=ActionGroup
   * Get a `ActionGroup` model from the `ActionGroup` ID
   */
  getActionGroup: DuplicateActionGroupGetData_getActionGroup;
}

export interface DuplicateActionGroupGetDataVariables {
  id: string;
}
