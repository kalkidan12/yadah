// import React, { useState } from "react";
// import { Formik, Form, Field } from "formik";

// const UserForm = ({ initialValues, isEdit, onClose, handleSubmitUser }) => {
//   const [serverError, setServerError] = useState("");
//   const [showPassword, setShowPassword] = useState(false);

//   const initialFormValues = isEdit
//     ? { ...initialValues }
//     : { firstName: "", lastName: "", email: "", password: "", role: "user" };

//   const handleSubmit = async (values, { setSubmitting }) => {
//     setServerError("");
//     try {
//       await handleSubmitUser(values);
//     } catch (error) {
//       setServerError(
//         error?.data?.message || error?.message || "Something went wrong."
//       );
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   return (
//     <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center overflow-y-auto p-4 z-50">
//       <div className="bg-amber-50 rounded-lg shadow-lg w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
//         <h2 className="text-2xl font-bold text-white mb-6 text-center p-2 rounded-md bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 shadow-md">
//           {isEdit ? "Update User" : "Add User"}
//         </h2>

//         <Formik
//           initialValues={initialFormValues}
//           onSubmit={handleSubmit}
//           enableReinitialize
//         >
//           {({ isSubmitting }) => (
//             <Form className="space-y-4">
//               {serverError && (
//                 <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-sm">
//                   {serverError}
//                 </div>
//               )}

//               <Field
//                 type="text"
//                 name="firstName"
//                 placeholder="First Name"
//                 className="w-full p-2 rounded bg-gray-200 focus:outline-none"
//                 required
//               />
//               <Field
//                 type="text"
//                 name="lastName"
//                 placeholder="Last Name"
//                 className="w-full p-2 rounded bg-gray-200 focus:outline-none"
//                 required
//               />
//               <Field
//                 type="email"
//                 name="email"
//                 placeholder="Email Address"
//                 className="w-full p-2 rounded bg-gray-200 focus:outline-none"
//                 required
//               />

//               {!isEdit && (
//                 <div className="relative">
//                   <Field
//                     type={showPassword ? "text" : "password"}
//                     name="password"
//                     placeholder="Password"
//                     className="w-full p-2 rounded bg-gray-200 focus:outline-none"
//                     required
//                   />
//                   <button
//                     type="button"
//                     onClick={() => setShowPassword(!showPassword)}
//                     className="absolute right-2 top-2 text-gray-600"
//                   >
//                     {showPassword ? "🙈" : "👁️"}
//                   </button>
//                 </div>
//               )}

//               <Field
//                 as="select"
//                 name="role"
//                 className="w-full p-2 rounded bg-gray-200 focus:outline-none"
//               >
//                 <option value="user">User</option>
//                 <option value="admin">Admin</option>
//                 <option value="system-admin">System Admin</option>
//               </Field>

//               <button
//                 type="submit"
//                 disabled={isSubmitting}
//                 className={`w-full py-2 px-4 rounded text-white font-bold transition ${
//                   isSubmitting
//                     ? "bg-gray-400 cursor-not-allowed"
//                     : isEdit
//                     ? "bg-blue-600 hover:bg-blue-700"
//                     : "bg-green-600 hover:bg-green-700"
//                 }`}
//               >
//                 {isSubmitting
//                   ? isEdit
//                     ? "Updating..."
//                     : "Adding..."
//                   : isEdit
//                   ? "Update User"
//                   : "Add User"}
//               </button>
//             </Form>
//           )}
//         </Formik>

//         <button
//           onClick={onClose}
//           className="mt-4 text-red-500 hover:underline text-sm"
//         >
//           Cancel
//         </button>
//       </div>
//     </div>
//   );
// };

// export default UserForm;

import React, { useState } from "react";
import { Formik, Form, Field } from "formik";

const UserForm = ({ initialValues, isEdit, onClose, handleSubmitUser }) => {
  const [serverError, setServerError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const initialFormValues = isEdit
    ? { ...initialValues, newPassword: "" } // add newPassword for update
    : { firstName: "", lastName: "", email: "", password: "", role: "user" };

  const handleSubmit = async (values, { setSubmitting }) => {
    setServerError("");
    try {
      await handleSubmitUser(values);
    } catch (error) {
      setServerError(
        error?.data?.message || error?.message || "Something went wrong."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex justify-center items-center overflow-y-auto p-4 z-50">
      <div className="bg-amber-50 rounded-lg shadow-lg w-full max-w-lg p-6 overflow-y-auto max-h-[90vh]">
        <h2 className="text-2xl font-bold text-white mb-6 text-center p-2 rounded-md bg-gradient-to-r from-amber-600 via-amber-700 to-orange-600 shadow-md">
          {isEdit ? "Update User" : "Add User"}
        </h2>

        <Formik
          initialValues={initialFormValues}
          onSubmit={handleSubmit}
          enableReinitialize
        >
          {({ isSubmitting }) => (
            <Form className="space-y-4">
              {serverError && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-2 rounded relative text-sm">
                  {serverError}
                </div>
              )}

              <Field
                type="text"
                name="firstName"
                placeholder="First Name"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
                required
              />
              <Field
                type="text"
                name="lastName"
                placeholder="Last Name"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
                required
              />
              <Field
                type="email"
                name="email"
                placeholder="Email Address"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
                required
              />

              {/* Password field for add and update */}
              <div className="relative">
                <Field
                  type={showPassword ? "text" : "password"}
                  name={isEdit ? "newPassword" : "password"}
                  placeholder={isEdit ? "New Password (optional)" : "Password"}
                  className="w-full p-2 rounded bg-gray-200 focus:outline-none"
                  {...(!isEdit && { required: true })}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-2 top-2 text-gray-600"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>

              <Field
                as="select"
                name="role"
                className="w-full p-2 rounded bg-gray-200 focus:outline-none"
              >
                <option value="user">User</option>
                <option value="admin">Admin</option>
                <option value="system-admin">System Admin</option>
              </Field>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-2 px-4 rounded text-white font-bold transition ${
                  isSubmitting
                    ? "bg-gray-400 cursor-not-allowed"
                    : isEdit
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-green-600 hover:bg-green-700"
                }`}
              >
                {isSubmitting
                  ? isEdit
                    ? "Updating..."
                    : "Adding..."
                  : isEdit
                  ? "Update User"
                  : "Add User"}
              </button>
            </Form>
          )}
        </Formik>

        <button
          onClick={onClose}
          className="mt-4 text-red-500 hover:underline text-sm"
        >
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserForm;
