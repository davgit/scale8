/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { AppQueryOptions } from "./globalTypes";

// ====================================================
// GraphQL query operation: AppErrorsQueryData
// ====================================================

export interface AppErrorsQueryData_getApp_error_stats_result {
  __typename: "AppGroupingErrors";
  error_file: string;
  error_message: string;
  error_column: string;
  error_row: string;
  first_page_url: string;
  user_count: number;
  event_count: number;
}

export interface AppErrorsQueryData_getApp_error_stats {
  __typename: "AppGroupingErrorsResponse";
  result: AppErrorsQueryData_getApp_error_stats_result[];
}

export interface AppErrorsQueryData_getApp {
  __typename: "App";
  /**
   * ID of the `App`
   */
  id: string;
  /**
   * Name of the Application
   */
  name: string;
  /**
   * Errors
   */
  error_stats: AppErrorsQueryData_getApp_error_stats;
}

export interface AppErrorsQueryData {
  /**
   * @bound=App
   * Get an App model from the App ID
   */
  getApp: AppErrorsQueryData_getApp;
}

export interface AppErrorsQueryDataVariables {
  id: string;
  appQueryOptions: AppQueryOptions;
}
