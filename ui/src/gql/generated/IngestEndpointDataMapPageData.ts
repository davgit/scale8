/* tslint:disable */
/* eslint-disable */
// This file was automatically generated and should not be edited.

// ====================================================
// GraphQL query operation: IngestEndpointDataMapPageData
// ====================================================

export interface IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_default_value = IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_default_value_DefaultValueContainer | IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray;

export interface IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value = IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainer | IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray;

export interface IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainer {
  __typename: "DefaultValueContainer";
  value: S8DataMapValue | null;
}

export interface IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray {
  __typename: "DefaultValueContainerArray";
  values: S8DataMapValue[] | null;
}

export type IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value = IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainer | IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value_DefaultValueContainerArray;

export interface IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps {
  __typename: "IngestEndpointDataMap";
  /**
   * ID of the `IngestEndpointDataMap`
   */
  id: string;
  /**
   * Key (Property Key) of the `IngestEndpointDataMap`
   */
  key: string;
  /**
   * Variable type (see `VarType`)
   */
  var_type: string;
  /**
   * Whether or not the property is optional or not
   */
  is_optional: boolean;
  /**
   * The default value. If no input is provided for this property, then the default value will be applied automatically
   */
  default_value: IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value | null;
}

export interface IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps {
  __typename: "IngestEndpointDataMap";
  /**
   * ID of the `IngestEndpointDataMap`
   */
  id: string;
  /**
   * Key (Property Key) of the `IngestEndpointDataMap`
   */
  key: string;
  /**
   * Variable type (see `VarType`)
   */
  var_type: string;
  /**
   * Whether or not the property is optional or not
   */
  is_optional: boolean;
  /**
   * The default value. If no input is provided for this property, then the default value will be applied automatically
   */
  default_value: IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_default_value | null;
  /**
   * If the variable type (see `VarType`) has been specified as an object or array
   * of objects, then this contains the child property definitions
   */
  child_ingest_endpoint_data_maps: IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps[];
}

export interface IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps {
  __typename: "IngestEndpointDataMap";
  /**
   * ID of the `IngestEndpointDataMap`
   */
  id: string;
  /**
   * Key (Property Key) of the `IngestEndpointDataMap`
   */
  key: string;
  /**
   * Variable type (see `VarType`)
   */
  var_type: string;
  /**
   * Whether or not the property is optional or not
   */
  is_optional: boolean;
  /**
   * The default value. If no input is provided for this property, then the default value will be applied automatically
   */
  default_value: IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_default_value | null;
  /**
   * If the variable type (see `VarType`) has been specified as an object or array
   * of objects, then this contains the child property definitions
   */
  child_ingest_endpoint_data_maps: IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps_child_ingest_endpoint_data_maps[];
}

export interface IngestEndpointDataMapPageData_getIngestEndpointRevision {
  __typename: "IngestEndpointRevision";
  /**
   * ID of the `IngestEndpointRevision`
   */
  id: string;
  /**
   * The `IngestEndpointRevision` has been finalised and locked to prevent further changes
   */
  locked: boolean;
  /**
   * The `IngestEndpointDataMaps`s that construct the payload (key => value) configuration for the `IngestEndpointRevision`
   */
  ingest_endpoint_data_maps: IngestEndpointDataMapPageData_getIngestEndpointRevision_ingest_endpoint_data_maps[];
}

export interface IngestEndpointDataMapPageData {
  /**
   * @bound=IngestEndpointRevision
   * Get a `IngestEndpointRevision` by it's ID
   */
  getIngestEndpointRevision: IngestEndpointDataMapPageData_getIngestEndpointRevision;
}

export interface IngestEndpointDataMapPageDataVariables {
  id: string;
}
