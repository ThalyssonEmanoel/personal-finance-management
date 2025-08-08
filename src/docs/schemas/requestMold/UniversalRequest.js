export function requestGetId() {
  const parameters = [
    {
      "name": "id",
      "in": "path",
      "description": "Insert just ID",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
  ];
  return {
    parameters,
  };
}
export function requestUserId() {
  const parameters = [
    {
      "name": "userId",
      "in": "query",
      "description": "Insert just userId",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
  ];
  return {
    parameters,
  };
}
export function requestWithIdAndUserId() {
  const parameters = [
    {
      "name": "id",
      "in": "query",
      "description": "Insert just id",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
    {
      "name": "userId",
      "in": "query",
      "description": "Insert just userId",
      "required": false,
      "schema": {
        "type": "integer",
        "minimum": 1
      }
    },
  ];
  return {
    parameters,
  };
}