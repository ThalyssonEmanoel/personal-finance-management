// // import usersSchemas from "../schemas/usersSchema.js";
// import commonResponses from "../schemas/swaggerCommonResponses.js";
// import { generateParameters } from "./utils/generateParameters.js"; // adjust the path as needed

// // HERE REMOVE THE _ID FIELD FROM THE FILTER, AS WE DO NOT WANT THE USER TO BE ABLE TO FILTER BY ID, ONLY BY THE FIELDS PRESENT IN THE FILTER
// // const filteredEstudanteFiltro = {
// //   ...usersSchemas.EstudanteFiltro,
// //   properties: Object.fromEntries(
// //     Object.entries(usersSchemas.EstudanteFiltro.properties).filter(([key]) => key !== "idUsu ")
// //   )
// // };

// const usersRoutes = {
//   "/users": {
//     get: {
//       tags: ["Users"],
//       summary: "Lists all users",
//       description:
//       `
//      #### Use Case
//      Allows the system to list all registered users, with the ability to filter by specific parameters.

//       #### Business Function
//       Provides a paginated listing of registered users, with detailed information for each user.

//        #### Business Rules Involved
//        - Allow filtering by defined parameters.
//        - Return an error if no users are registered.

//        #### Expected Result
//        Returns a paginated list of users with detailed information.`,
//       security: [{ bearerAuth: [] }],
//       // Generating parameters recursively from the JSON Schema
//       parameters: generateParameters(filteredUserFiltro), // This is where we use the constant generated above
//       responses: {
//         200: commonResponses[200]("#/components/schemas/UserListingpaginated"),
//         400: commonResponses[400](),
//         401: commonResponses[401](),
//         404: commonResponses[404](),
//         498: commonResponses[498](),
//         500: commonResponses[500]()
//       }
//     },
//   },
// };

// export default usersRoutes;
