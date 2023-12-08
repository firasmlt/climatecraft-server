export interface ValidationError {
  value: String;
  msg: String;
  path: String;
  location: String;
}
export interface ValidationResult {
  errors?: Object[];
  formatter?: Function;
}
